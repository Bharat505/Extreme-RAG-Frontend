import axios from "axios";

// ✅ Use environment variable for backend URL (set in Vercel)
const API_URL = process.env.REACT_APP_BASE_URL || "https://extreme-rag-backend.onrender.com";

export const uploadPDFs = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const response = await axios.post(`${API_URL}/run_pipeline/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Upload error:", error);
    return null;
  }
};

// ✅ Fetch each result separately as soon as it's available
export const fetchFinalSummaries = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-final-summaries/`);
    return response.data;
  } catch (error) {
    console.error("❌ Fetch summaries error:", error);
    return null;
  }
};

export const fetchComparisons = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-comparisons/`);
    return response.data;
  } catch (error) {
    console.error("❌ Fetch comparisons error:", error);
    return null;
  }
};

export const fetchTopQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-top-questions/`);
    return response.data;
  } catch (error) {
    console.error("❌ Fetch top questions error:", error);
    return null;
  }
};

export const fetchTableVisuals = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-table-visuals/`);
    return response.data;
  } catch (error) {
    console.error("❌ Fetch table visuals error:", error);
    return null;
  }
};

export const askQuestion = async (question) => {
  try {
    const response = await axios.post(`${API_URL}/ask-question/`, { question });
    return response.data;
  } catch (error) {
    console.error("❌ Error asking question:", error);
    return { answer: "Error fetching answer", source: [] };
  }
};
