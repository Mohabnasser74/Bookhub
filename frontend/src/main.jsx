import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SnackbarProvider } from "notistack";

export const api = "https://bookhub-ik4s.onrender.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SnackbarProvider>
    <App />
  </SnackbarProvider>
);
