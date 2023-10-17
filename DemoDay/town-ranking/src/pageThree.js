import React from "react";
import ImageComp from "./components/ImageComp";
import wind_image from "./resources/wind_bigger.png";
import pressure_image from "./resources/pressureDist.png";
import threeFigs from "./resources/3figs.png";
import altitudeGraph from "./resources/altitudeGraph.png";
import populationDensityGraph from "./resources/populationDensityGraph.png";
import woodBurnerDensityGraph from "./resources/woodBurnerDensityGraph.png";

function PageThree() {
  return (
    <div className="overflow-hidden h-full">
      {/* Main content */}
      <div className="flex flex-col items-start max-w-7xl mx-auto h-full border rounded-lg overflow-hidden shadow-lg bg-white p-4">
        
        <h2 className="text-2xl font-bold mb-4">Metadata:</h2>

        {/* Container for the images - using grid layout for better spacing */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Each ImageComp represents an image, so they are direct children of the grid */}
          <ImageComp
            img={wind_image}
            name="Wind Speed Distribution"
          />
          <ImageComp
            img={pressure_image}
            name="Atmospheric Pressure Distribution"
          />
          <ImageComp
            img={altitudeGraph}
            name="Altitude"
          />
                    <ImageComp
            img={woodBurnerDensityGraph}
            name="Home Wood Burner Density Per KM²"
          />
                    <ImageComp
            img={populationDensityGraph}
            name="Population Density Per KM²"
          />
        </div>
      </div>
    </div>
  );
}

export default PageThree;
