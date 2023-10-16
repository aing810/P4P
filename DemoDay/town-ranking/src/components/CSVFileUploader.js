import React, { useCallback } from 'react';

const CSVFileUploader = ({ onUpload }) => {
  const handleUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file chosen");
      return;
    }

    // Optional: Check if the file is a CSV file by its MIME type or extension
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      console.log("Not a CSV file");
      return;
    }

    // If a handler function has been provided, call it with the file
    if (onUpload) {
      onUpload(file);
    }
  }, [onUpload]);

  return (
    <div>
      <label htmlFor="csvFileUpload" style={{ cursor: 'pointer' }}>
        <strong>Choose a CSV file</strong>
      </label>
      <input
        id="csvFileUpload"
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
    </div>
  );
};

export default CSVFileUploader;
