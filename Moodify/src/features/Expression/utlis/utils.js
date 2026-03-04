import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

/* -------------------------- INIT FUNCTION -------------------------- */

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
  if (!videoRef.current) {
    throw new Error("Video ref not attached");
  }

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );

  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  streamRef.current = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
  });

  videoRef.current.srcObject = streamRef.current;
  await videoRef.current.play();
};

/* -------------------------- DETECT FUNCTION -------------------------- */

export const detect = ({ landmarkerRef, videoRef, setExpression }) => {
  const landmarker = landmarkerRef.current;
  const video = videoRef.current;

  if (!landmarker) {
    throw new Error("Landmarker not initialized");
  }

  if (!video || video.readyState < 2) {
    return "Video not ready";
  }

  const results = landmarker.detectForVideo(video, performance.now());

  if (!results.faceBlendshapes || results.faceBlendshapes.length === 0) {
    setExpression("No face detected");
    return "No face detected";
  }

  const blendshapes = results.faceBlendshapes[0].categories;

  const getScore = (name) =>
    blendshapes.find((b) => b.categoryName === name)?.score ?? 0;

  /* ---------------- Raw Scores ---------------- */

  const smileLeft = getScore("mouthSmileLeft");
  const smileRight = getScore("mouthSmileRight");

  const jawOpen = getScore("jawOpen");

  const browUp = getScore("browInnerUp");
  const browDownLeft = getScore("browDownLeft");
  const browDownRight = getScore("browDownRight");

  const mouthFrownLeft = getScore("mouthFrownLeft");
  const mouthFrownRight = getScore("mouthFrownRight");

  const eyeLookDownLeft = getScore("eyeLookDownLeft");
  const eyeLookDownRight = getScore("eyeLookDownRight");
  const mouthShrugLower = getScore("mouthShrugLower");

  /* ---------------- Expression Scores ---------------- */

  // HAPPY
  const happyScore = (smileLeft + smileRight) / 2;

  // SURPRISED
  const surprisedScore = jawOpen * 0.7 + browUp * 0.5 - happyScore * 0.3; // prevent confusion with smiling

  // SAD (weighted composite model)
  const browSad = (browDownLeft + browDownRight) / 2;
  const mouthSad = (mouthFrownLeft + mouthFrownRight) / 2;
  const eyeSad = (eyeLookDownLeft + eyeLookDownRight) / 2;
  const shrugLower = mouthShrugLower / 2;

  const sadComposite = mouthSad * 0.35 + eyeSad * 0.15 + shrugLower;

  let sadScore = 0;

  if (
    sadComposite > 0.45 && // strong sadness activation
    jawOpen < 0.25 && // not open mouth
    happyScore < 0.25 && // not smiling
    shrugLower > 0.4 // not surprised
  ) {
    sadScore = sadComposite;
  }

  /* ---------------- Decision Logic ---------------- */

  let currentExpression = "Neutral";

  const scores = {
    Happy: happyScore,
    Surprised: surprisedScore,
    Sad: sadScore,
  };

  const entries = Object.entries(scores);
  entries.sort((a, b) => b[1] - a[1]);

  const [topExpression, topScore] = entries[0];
  const [, secondScore] = entries[1];

  const MIN_THRESHOLD = 0.4; // minimum activation
  const DOMINANCE_MARGIN = 0.15; // must clearly win

  if (topScore > MIN_THRESHOLD && topScore - secondScore > DOMINANCE_MARGIN) {
    currentExpression = topExpression;
  }

  setExpression(currentExpression);
  return currentExpression;
};
