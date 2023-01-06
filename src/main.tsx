import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { PageRoute } from "./PageRoute";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PageRoute />
  </React.StrictMode>
);
