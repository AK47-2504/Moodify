import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import "../styles/expression.scss";
import { calculateExpression } from "../utils/expressionUtils";

export const useFaceExpression = () => {
  const videoRef = useRef(null);
  const sleepStartRef = useRef(null);
  const [expression, setExpression] = useState("Neutral");

  const lastExpressionRef = useRef("Neutral");
  const frameCounter = useRef(0);
  console.log("Hook Mounted");
  const startDetectRef = useRef(null);
  useEffect(() => {
    let faceLandmarker;
    let stream;
    let animationId;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
        );
        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
        });
        console.log("Init Running");
        startCamera();
      } catch (err) {
        console.error("Initialization Error:", err);
      }
    };

    const startCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      console.log(videoRef.current);
      await videoRef.current.play();
      console.log("Requesting Camera...");
    };

    const detect = () => {
      if (!faceLandmarker || !videoRef.current) return;

      const results = faceLandmarker.detectForVideo(
        videoRef.current,
        Date.now(),
      );

      if (results.faceBlendshapes?.length > 0) {
        const categories = results.faceBlendshapes[0].categories;

        const now = Date.now();

        const newExpression = calculateExpression({
          categories,
          sleepStartRef,
          now,
        });

        frameCounter.current += 1;

        if (
          newExpression !== lastExpressionRef.current &&
          frameCounter.current % 5 === 0
        ) {
          lastExpressionRef.current = newExpression;
          setExpression(newExpression);
        }
      }

      animationId = requestAnimationFrame(detect);
    };

    const startDetecting = () => {
      requestAnimationFrame(detect);
    };

    // ref me assign karo
    startDetectRef.current = startDetecting;
    init();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    expression,
    startDetecting: () => startDetectRef.current?.(),
  };
};
