import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  uploadPDFs,
  fetchFinalSummaries,
  fetchComparisons,
  fetchTopQuestions,
  fetchTableVisuals,
  askQuestion,
} from "../api";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [finalSummaries, setFinalSummaries] = useState({});
  const [comparisons, setComparisons] = useState({});
  const [topQuestions, setTopQuestions] = useState({ overall: [], perPDF: {} });
  const [tableVisuals, setTableVisuals] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf",
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setMessage("");
    },
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("⚠️ No files selected.");
      return;
    }

    setProcessing(true);
    setMessage("📤 Uploading and processing PDFs...");

    try {
      const result = await uploadPDFs(files);
      if (!result) throw new Error("Processing failed");
      setMessage("✅ Processing started. Fetching results...");

      // ✅ Start polling results immediately
      pollResults();
    } catch (error) {
      console.error("❌ Processing error:", error);
      setMessage("❌ Error during processing.");
    }

    setProcessing(false);
  };

  const pollResults = async () => {
    const interval = setInterval(async () => {
      try {
        const summaries = await fetchFinalSummaries();
        if (summaries) setFinalSummaries(summaries);

        const comps = await fetchComparisons();
        if (comps) setComparisons(comps);

        const topQs = await fetchTopQuestions();
        if (topQs) {
          setTopQuestions({
            overall: topQs.top_10_overall_questions || [],
            perPDF: topQs.top_10_per_pdf_questions || {},
          });
        }

        const tables = await fetchTableVisuals();
        if (tables && Array.isArray(tables)) {
          setTableVisuals(tables.slice(-5)); // ✅ Show only last 5 tables
        }

        // ✅ Stop polling when all results are available
        if (summaries && comps && topQs && tables) {
          clearInterval(interval);
          setMessage("✅ Processing complete!");
        }
      } catch (error) {
        console.error("⚠️ Error fetching results:", error);
      }
    }, 3000); // ✅ Poll every 3 seconds
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setMessage("⚠️ Please enter a question.");
      return;
    }

    setMessage("🔎 Fetching answer...");
    const response = await askQuestion(question);

    setAnswer(response.answer);
    setSources(response.source || []);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* 📂 Upload Section */}
      <h2 style={{ textAlign: "center", fontWeight: "bold" }}>📂 Upload PDF for Processing</h2>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #aaa",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        <input {...getInputProps()} />
        <h3>📁 PDF Upload</h3>
        <p>Drag & drop PDFs here, or click to select multiple files</p>
      </div>

      {files.length > 0 && (
        <div>
          <h4>📄 Selected Files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleUpload} disabled={processing} style={{ marginTop: "10px" }}>
        {processing ? "Processing..." : "Upload & Process"}
      </button>

      <hr />

      {/* 📌 Final Summaries */}
      <h3>📌 Final Summaries</h3>
      {Object.keys(finalSummaries).length > 0 ? (
        Object.entries(finalSummaries).map(([pdfId, summary]) => (
          <div key={pdfId} style={{ marginBottom: "10px" }}>
            <h4>📄 {summary["Title & Subject"]}</h4>
            {Object.entries(summary).map(([key, value]) => (
              key !== "Title & Subject" && (
                <p key={key}><strong>{key}:</strong> {value}</p>
              )
            ))}
          </div>
        ))
      ) : (
        <p>"No summaries available."</p>
      )}

      {/* 🔎 Comparisons */}
      <h3>🔎 Comparisons</h3>
      {Object.keys(comparisons).length > 0 ? (
        <div>
          {Object.entries(comparisons).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value}</p>
          ))}
        </div>
      ) : (
        <p>"No comparisons available."</p>
      )}

      {/* ❓ Top Questions */}
      <h3>❓ Top Questions</h3>
      {topQuestions.overall.length > 0 ? (
        <ul>
          {topQuestions.overall.map((q, index) => (
            <li key={index} onClick={() => setQuestion(q)} style={{ cursor: "pointer", color: "blue" }}>
              {q}
            </li>
          ))}
        </ul>
      ) : (
        <p>"No top questions available."</p>
      )}

      {/* 📊 Table Visualizations */}
      <h3>📊 Table Visualizations</h3>
      {tableVisuals.length > 0 ? (
        <div>
          <h4>🖼️ Latest Table Visualizations</h4>
          {tableVisuals.map((filePath, index) => (
            <iframe
              key={index}
              src={`http://127.0.0.1:8000/static/table_visualizations/${filePath}`}
              width="100%"
              height="400px"
              style={{ border: "none", marginBottom: "10px" }}
              title={`Table Visualization ${index + 1}`}
            />
          ))}
        </div>
      ) : (
        <p>"No table visualizations available."</p>
      )}

      <hr />

      {/* ❓ Ask a Question */}
      <h3>❓ Ask a Question</h3>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question..."
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={handleAskQuestion} style={{ marginBottom: "10px" }}>Ask</button>

      {answer && (
        <div>
          <h4>✅ Answer:</h4>
          <p>{answer}</p>
          {sources.length > 0 && (
            <div>
              <h4>📌 Sources:</h4>
              <ul>{sources.map((src, index) => <li key={index}>{src}</li>)}</ul>
            </div>
          )}
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
