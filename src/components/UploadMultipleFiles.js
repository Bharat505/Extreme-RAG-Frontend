import React, { useState } from "react";

function UploadMultipleFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("No files selected.");
      return;
    }
    setError(null);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]); 
      // The key "files" must match what FastAPI expects at: async def upload_pdfs(files: List[UploadFile] = File(...)):
    }

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const data = await response.json();
      setUploadResponse(data);
    } catch (err) {
      console.error("Upload error:", err);
      setError(`❌ Upload failed: ${err.message || err}`);
    }
  };

  return (
    <div>
      <h2>Upload Multiple PDFs</h2>

      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileChange}
      />

      <button onClick={handleUpload}>
        Upload
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {uploadResponse && (
        <pre style={{ background: "#eee", padding: "10px" }}>
          {JSON.stringify(uploadResponse, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default UploadMultipleFiles;
