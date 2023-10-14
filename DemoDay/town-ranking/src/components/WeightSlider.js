import React from "react";

function WeightSlider({ name, value, onChange }) {
  return (
    <div className="slider-container flex flex-col items-start space-y-2">
      <label className="text-xl mb-1">{name}</label>
      <div className="flex items-center space-x-2 w-full">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(name, parseFloat(e.target.value))}
          className="w-full"
        />
        <span>{value.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default WeightSlider;
