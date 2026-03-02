import { useFaceExpression } from "../hooks/FaceExpression";
import "../styles/expression.scss";

const FaceCamera = () => {
  const { videoRef, expression, startDetecting } = useFaceExpression();

  return (
    <div className="face-container">
      <div className="face-card">
        <h1>Facial Expression Detector</h1>

        <div className="video-wrapper">
          <video autoPlay playsInline muted ref={videoRef} />
        </div>
        <button
          onClick={() => {
            startDetecting();
          }}
        >
          Detect Expression
        </button>
        <div className={`expression-badge ${expression.toLowerCase()}`}>
          {expression}
        </div>
      </div>
    </div>
  );
};

export default FaceCamera;
