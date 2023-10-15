import React from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

function WeightSlider({ name, value, onChange }) {
  const outputNames = {
    wind_score: "Wind Speed",
    pressure_score: "Atmospheric Pressure",
    altitude_score: "Altitude",
    density_score: "Density",
    woodburner_score: "Wood Burner Density",
  };
  let nameOut = outputNames[name];

  return (
    <div className="slider-container flex flex-col items-start space-y-2 bg-white p-4 rounded-md shadow-md">
      <Typography variant="h6" className="text-lg font-semi mb-1">
        {nameOut}
      </Typography>
      <div className="flex items-center space-x-2 w-full">
        <Slider
          value={value * 100}
          onChange={(event, newValue) => onChange(name, newValue / 100)}
          valueLabelDisplay="auto"
          aria-labelledby="continuous-slider"
          className="w-full"
          color="secondary"
          ValueLabelComponent={(props) => (
            <Typography
              component="span"
              variant="caption"
              className="bg-black text-white p-1 rounded"
              {...props}
            >
              {props.value}
            </Typography>
          )}
          sx={{
            color: "#285954",  // Theme color
            height: 8,
            "& .MuiSlider-thumb": {
              width: 20,
              height: 20,
              backgroundColor: "#fff",
              border: `2px solid #285954`,  // Theme color for the thumb border
              "&:hover, &.Mui-focusVisible, &.Mui-active": {
                boxShadow: "inherit",
              },
            },
            "& .MuiSlider-valueLabel": {
              top: -22,
              fontSize: "0.9rem",
            },
            "& .MuiSlider-track": {
              height: 8,
              borderRadius: 4,
            },
            "& .MuiSlider-rail": {
              height: 8,
              borderRadius: 4,
            },
          }}
        />
        <span className="text-sm font-medium">{value.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default WeightSlider;
