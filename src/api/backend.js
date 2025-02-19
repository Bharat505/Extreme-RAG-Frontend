import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// ✅ Function to Upload Multiple PDFs
export const uploadMultipleFiles = async (files) => {
    try {
        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        const response = await axios.post(`${API_URL}/upload-multiple`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Upload failed:", error.response?.data || error.message);
        return { status: "error", message: error.message };
    }
};

// ✅ Function to Upload a Single PDF
export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${API_URL}/api/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Upload failed:", error.response?.data || error.message);
        return { status: "error", message: error.message };
    }
};

// ✅ Function to Query a Document
export const queryDocument = async (query) => {
    try {
        const response = await axios.post(`${API_URL}/query`, { query });
        return response.data;
    } catch (error) {
        console.error("❌ Query failed:", error.response?.data || error.message);
        return { status: "error", message: error.message };
    }
};
