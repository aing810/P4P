import React, { useState } from 'react';


const ImageComp = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
    <h1 className='text-xs font-bold pb-4'>{props.name}</h1>
      <div className="dummy-content cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <img src={props.img} alt="Wind"/>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 w-full h-full bg-gray-900 bg-opacity-25 flex items-center justify-center z-50" 
          onClick={() => setIsModalOpen(false)}
          style={{ animation: 'fadeIn 0.5s ease-in-out' }} 
        >
          <div className="bg-white p-8 animate-scaleUp">
            <img src={props.img} alt="Wind" className="object-contain w-[80vh]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageComp;
