import { useEffect, useRef, useState, useCallback } from "react";
import { detect, init } from "../utlis/utils";
import "../styles/expression.scss";

export default function FaceExpression({ onClick = () => {} }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  const [expression, setExpression] = useState("Initializing...");
  const [isReady, setIsReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  /* -------------------------- INIT -------------------------- */

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      try {
        await init({ landmarkerRef, videoRef, streamRef });

        if (isMounted) {
          setIsReady(true);
          setExpression("Ready");
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        if (isMounted) {
          setExpression("Initialization failed");
        }
      }
    }

    setup();

    return () => {
      isMounted = false;

      // Stop animation loop
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Close landmarker
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }

      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  /* -------------------------- DETECTION LOOP -------------------------- */

  const detectionLoop = useCallback(() => {
    const result = detect({
      landmarkerRef,
      videoRef,
      setExpression,
    });

    if (result) {
      onClick(result);
    }

    animationRef.current = requestAnimationFrame(detectionLoop);
  }, [onClick]);

  const startDetection = () => {
    if (!isReady || isDetecting) return;

    setIsDetecting(true);
    detectionLoop();
  };

  const stopDetection = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setIsDetecting(false);
  };

  /* -------------------------- UI -------------------------- */

  return (
    <div className="face-detector">
      <div className="face-detector__card">
        <div className="face-detector__video-wrapper">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="face-detector__video"
          />
          <div
            className={`face-detector__status status--${expression?.toLowerCase()}`}
          >
            {expression}
          </div>
        </div>

        <div className="face-detector__controls">
          <button
            className="btn btn--primary"
            onClick={startDetection}
            disabled={!isReady || isDetecting}
          >
            Start Detecting
          </button>

          <button
            className="btn btn--danger"
            onClick={stopDetection}
            disabled={!isDetecting}
          >
            Stop Detecting
          </button>
        </div>
      </div>
    </div>
  );
}
