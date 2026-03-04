// import FaceDetector from "./features/Expression/components/FaceDetector";
import { RouterProvider } from "react-router";
import { Router } from "./app.routes";
import "./features/shared/styles/global.scss";
import { AuthProvider } from "./features/auth/auth.context";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Router} />
    </AuthProvider>
  );
}

export default App;
