import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { syncMotionClass } from "./lib/motion-preference";

syncMotionClass();
createRoot(document.getElementById("root")!).render(<App />);
