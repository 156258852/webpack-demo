import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import "./style.scss";
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
