import React, { useCallback, useState } from 'react';

const CSVFileUploader = ({ onUpload, id }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file chosen");
      return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      console.log("Not a CSV file");
      return;
    }

    setUploadedFile(file.name);

    if (onUpload) {
      onUpload(file);
      console.log('uploaded', file)
    }
  }, [onUpload]);

  return (
    <div className="flex items-center space-x-2"> {/* Flex container to keep elements in line */}
      <label htmlFor={id} className="cursor-pointer text-black-600 hover:text-green-800"> {/* Adjusted styles */}
        {uploadedFile ? <strong className='text-green-800'>Uploaded:</strong> : <strong>Choose a CSV file</strong>}
      </label>
      <input
        id={id}
        type="file"
        accept=".csv"
        className="hidden" // Tailwind class for display: none
        onChange={handleUpload}
      />
      {uploadedFile && <span className="text-sm font-medium">{uploadedFile}</span>} {/* Display file name */}
    </div>
  );
};

export default CSVFileUploader;
