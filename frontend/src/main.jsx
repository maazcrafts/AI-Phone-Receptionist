import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 900, margin: "0 auto", padding: 40 }}>
      <h1>AI Phone Receptionist</h1>
      <p>Local-first voice receptionist development dashboard.</p>
      <p>Phase 1: voice pipeline setup.</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
