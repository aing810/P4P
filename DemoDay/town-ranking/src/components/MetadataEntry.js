import React from 'react';

const TextEntry = ({ placeholder, value, onChange }) => {
  // Function to validate input and allow only numbers and periods
  const handleKeyPress = (e) => {
    const regex = /^[0-9.]*$/; // Regular expression to allow numbers and periods
    const inputChar = String.fromCharCode(e.charCode);

    if (!regex.test(inputChar)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={handleKeyPress}
      className="border-2 border-green-600 rounded py-2 pr-8 w-32" // Adjusted padding and width classes
    />
  );
};

export default TextEntry;
