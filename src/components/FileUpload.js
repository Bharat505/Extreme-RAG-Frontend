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
  const [currentStep, setCurrentStep] = useState("");
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
      setMessage("No files selected.");
      return;
    }

    setProcessing(true);
    setMessage("📤 Uploading and processing PDFs...");
    setCurrentStep("🔍 Extracting Content...");

    try {
      const result = await uploadPDFs(files);
      if (!result) throw new Error("Processing failed");
      setMessage("🔄 Processing started. Fetching results...");
      pollResults();
    } catch (error) {
      console.error("❌ Processing error:", error);
      setMessage("Error during processing.");
    }
  };

  const pollResults = async () => {
    let pollAttempts = 0;
    const maxPollAttempts = 10;
    const interval = setInterval(async () => {
      pollAttempts++;
      if (pollAttempts >= maxPollAttempts) {
        clearInterval(interval);
        setProcessing(false);
        setMessage("⚠️ Could not fetch all results. Please try again later.");
        return;
      }

      try {
        setCurrentStep("📑 Summarizing Content...");
        const summaries = await fetchFinalSummaries();
        const comps = await fetchComparisons();
        const topQs = await fetchTopQuestions();
        const tables = await fetchTableVisuals();

        if (summaries && Object.keys(summaries).length > 0) {
          setFinalSummaries(summaries);
          setCurrentStep("📌 Final Summaries Available!");
        }
        if (comps && Object.keys(comps).length > 0) {
          setComparisons(comps);
          setCurrentStep("🔎 Comparisons Available!");
        }
        if (topQs) {
          setTopQuestions({
            overall: topQs.top_10_overall_questions || [],
            perPDF: topQs.top_10_per_pdf_questions || {},
          });
          setCurrentStep("❓ Top Questions Available!");
        }
        if (tables && tables.table_visuals && tables.table_visuals.length > 0) {
          setTableVisuals(tables.table_visuals.slice(-10));
          setCurrentStep("📊 Table Visualizations Ready!");
        }

        if (summaries && comps && topQs && tables) {
          clearInterval(interval);
          setProcessing(false);
          setMessage("✅ Processing complete!");
          setCurrentStep("");
        }
      } catch (error) {
        console.error("⚠️ Error fetching results:", error);
      }
    }, 5000);
  };

  const handleAskQuestion = async () => {
    if (!question) {
      setMessage("Please enter a question.");
      return;
    }

    setMessage("🔎 Fetching answer...");
    try {
      const response = await askQuestion(question);
      setAnswer(response.answer);
      setSources(response.source || []);
    } catch (error) {
      console.error("❌ Error fetching answer:", error);
      setMessage("Error retrieving answer.");
    } finally {
      setMessage("");
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>📄 Smart PDF Insights Assistant</h1>
      <p style={subTextStyle}>
        🔍 Please be patient! This process extracts, chunks, analyzes, and provides top questions, summaries, and comparisons.
      </p>

      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>📁 Drag & drop PDFs here, or click to select multiple files</p>
      </div>

      <button onClick={handleUpload} disabled={processing} style={buttonStyle}>
        {processing ? "Processing..." : "Upload & Process"}
      </button>

      {currentStep && <p style={{ color: "blue", fontWeight: "bold" }}>{currentStep}</p>}

      <hr />

      <h3>📌 Final Summaries</h3>
      {Object.entries(finalSummaries).map(([pdfId, summary]) => (
        <div key={pdfId} style={resultBoxStyle}>
          <h4>📄 {summary["Title & Subject"]}</h4>
          {Object.entries(summary)
            .filter(([key, value]) => value !== null && key !== "Title & Subject")
            .map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
          ))}
        </div>
      ))}

      <h3>🔎 Comparisons</h3>
      {Object.keys(comparisons).length > 0 ? (
        <div style={resultBoxStyle}>
          {Object.entries(comparisons).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value}</p>
          ))}
        </div>
      ) : (
        <p>No comparisons available.</p>
      )}

      <h3>❓ Top Questions</h3>
      {topQuestions.overall.length > 0 ? (
        <div style={resultBoxStyle}>
          <h4>🌟 Overall Top Questions</h4>
          <ul>
            {topQuestions.overall.map((q, index) => (
              <li key={index} style={questionStyle} onClick={() => setQuestion(q)}>
                {q}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No top questions available.</p>
      )}

      <h3>📊 Table Visualizations</h3>
      {tableVisuals.length > 0 ? (
        <ul>
          {tableVisuals.map((url, index) => (
            <li key={index}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                View Visualization {index + 1}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No table visualizations available.</p>
      )}

      <h3>❓ Ask a Question</h3>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter your question..." style={inputStyle} />
      <button onClick={handleAskQuestion} style={buttonStyle}>Ask</button>

      {answer && <div style={resultBoxStyle}><h4>✅ Answer:</h4><p>{answer}</p></div>}

      {message && <p>{message}</p>}
    </div>
  );
};

// ✅ Added Missing Styles
const containerStyle = { padding: "20px", fontFamily: "Arial, sans-serif" };
const titleStyle = { textAlign: "center", fontSize: "26px", fontWeight: "bold" };
const subTextStyle = { textAlign: "center", color: "gray", fontSize: "16px", marginBottom: "15px" };
const dropzoneStyle = { border: "2px dashed #aaa", padding: "20px", textAlign: "center", cursor: "pointer" };
const resultBoxStyle = { backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "8px", marginBottom: "10px" };
const buttonStyle = { padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", cursor: "pointer" };
const inputStyle = { width: "100%", padding: "10px", marginBottom: "10px" };
const questionStyle = { cursor: "pointer", color: "#007bff", marginBottom: "5px" };

export default FileUpload;
