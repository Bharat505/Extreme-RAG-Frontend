import React from "react";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Upload PDF for Processing</h1>
      <FileUpload />
    </div>
  );
}

export default App;
