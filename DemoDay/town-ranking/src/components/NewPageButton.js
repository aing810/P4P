import React from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const NewPageButton = ({ link, text, target }) => {
  const handleClick = () => {
    window.open(link, target || '_blank');
  };

  return (
    <button 
      onClick={handleClick} 
      className="flex w-32 items-center justify-center text-black-100 px-4 py-2 rounded hover:bg-#1f4a45 transition duration-300 space-x-2" // Added flex display and space between text and icon
    >
      <span>{text || 'Open in New Page'}</span> {/* Enclosed text in a span for better styling control */}
      <OpenInNewIcon style={{ color: 'black' }} /> {/* This is your icon with its color set to white to match the text */}
    </button>
  );
};

export default NewPageButton;
