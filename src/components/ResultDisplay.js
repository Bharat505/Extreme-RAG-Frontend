import React from "react";

function ResultDisplay({ answer, sources }) {
  if (!answer && (!sources || sources.length === 0)) {
    return null;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Answer</h3>
      <div style={{ background: "#f9f9f9", padding: "10px" }}>
        {answer || "No answer found."}
      </div>

      <h3>Sources</h3>
      {sources && sources.length > 0 ? (
        sources.map((src, idx) => (
          <div 
            key={idx} 
            style={{ 
              border: "1px solid #ccc", 
              background: "#fff", 
              margin: "5px 0", 
              padding: "10px" 
            }}
          >
            {src}
          </div>
        ))
      ) : (
        <p>No sources available.</p>
      )}
    </div>
  );
}

export default ResultDisplay;
