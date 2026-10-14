import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/ibm-plex-mono/400.css";
import PixelLab from "./PixelLab";
import "./base.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PixelLab />
  </React.StrictMode>,
);
