import React, { useState } from "react";
import FileViewer from "react-file-viewer";

function CSVModal({ filePath, buttonLabel }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>{buttonLabel}</button>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full h-3/4 overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
            <FileViewer fileType="csv" filePath={filePath} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CSVModal;
