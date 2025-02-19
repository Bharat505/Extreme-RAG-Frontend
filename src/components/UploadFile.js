import React, { useState } from "react";
import { uploadFile } from "../api/backend";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        setMessage("Uploading...");

        try {
            const response = await uploadFile(file);
            if (response.status === "success") {
                setMessage("✅ Upload Successful!");
            } else {
                setMessage("❌ Upload Failed: " + response.message);
            }
        } catch (error) {
            setMessage("❌ Upload Error: " + error.message);
        }
    };

    return (
        <div>
            <h2>Upload PDF</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
};

export default UploadFile;
