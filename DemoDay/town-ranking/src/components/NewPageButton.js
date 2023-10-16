import React from 'react';

const NewPageButton = ({ link, text, target }) => {
  const handleClick = () => {
    window.open(link, target || '_blank');
  };

  return (
    <button onClick={handleClick}>
      {text || 'Open in New Page'}
    </button>
  );
};

export default NewPageButton;
