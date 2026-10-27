import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";

// Aquí React toma el <div id="root"> del index.html y dibuja la aplicación dentro
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
