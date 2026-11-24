import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { TodoProvider } from "./context/TodoContext.jsx";
import { migrateLegacyStorage } from "./utils/storage.js";
import "./index.css";

migrateLegacyStorage();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CategoryProvider>
              <TodoProvider>
                <App />
              </TodoProvider>
            </CategoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
