import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import "./style.scss";
import style from './test.module.css';
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <div className={style.title}>webpack study demo </div>
      <App />
    </React.StrictMode>
  );
}
