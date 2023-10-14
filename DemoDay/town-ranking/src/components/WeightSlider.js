import React from 'react';

function WeightSlider({ name, value, onChange }) {
    return (
        <div className="slider-container">
            <label>{name}</label>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={value}
                onChange={e => onChange(name, parseFloat(e.target.value))}
            />
            <span>{value.toFixed(2)}</span>
        </div>
    );
}

export default WeightSlider;