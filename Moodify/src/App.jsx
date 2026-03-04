// import FaceDetector from "./features/Expression/components/FaceDetector";
import { RouterProvider } from "react-router";
import { Router } from "./app.routes";
import "./features/shared/styles/global.scss";

const App = () => {
  return <RouterProvider router={Router} />;
};

export default App;
