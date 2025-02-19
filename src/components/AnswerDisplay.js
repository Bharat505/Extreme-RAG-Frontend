import React from "react";

const AnswerDisplay = ({ answer, sources }) => {
  if (!answer) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>✅ Answer</h3>
      <p style={styles.answer}>{answer}</p>

      {sources && sources.length > 0 && (
        <div style={styles.sourceContainer}>
          <h4 style={styles.sourceHeader}>📌 Sources:</h4>
          <ul style={styles.sourceList}>
            {sources.map((source, index) => (
              <li key={index} style={styles.sourceItem}>
                {source}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ✅ Styled Components
const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    marginTop: "15px",
  },
  header: {
    color: "#28A745",
    fontSize: "18px",
    marginBottom: "8px",
  },
  answer: {
    fontSize: "16px",
    color: "#333",
    lineHeight: "1.5",
  },
  sourceContainer: {
    marginTop: "10px",
  },
  sourceHeader: {
    color: "#007BFF",
    fontSize: "16px",
  },
  sourceList: {
    listStyleType: "none",
    padding: "0",
  },
  sourceItem: {
    padding: "5px 0",
    color: "#555",
    fontSize: "14px",
  },
};

export default AnswerDisplay;
