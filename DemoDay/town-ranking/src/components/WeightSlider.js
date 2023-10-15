import React from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

function WeightSlider({ name, value, onChange }) {
  return (
    <div className="slider-container flex flex-col items-start space-y-2 bg-white p-4 rounded-md shadow-md">
      <Typography variant="h6" className="text-lg font-semibold mb-1">
        {name}
      </Typography>
      <div className="flex items-center space-x-2 w-full">
        <Slider
          value={value * 100} // MUI slider expects values between 0 and 100
          onChange={(event, newValue) => onChange(name, newValue / 100)}
          valueLabelDisplay="auto"
          aria-labelledby="continuous-slider"
          className="w-full"
        />
        <span className="text-sm font-medium">{value.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default WeightSlider;
