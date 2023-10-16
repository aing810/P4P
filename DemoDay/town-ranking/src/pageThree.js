import React from "react";
import ImageComp from "./components/ImageComp";
import wind_image from "./resources/wind_bigger.png";
import pressure_image from "./resources/pressureDist.png";
import threeFigs from "./resources/3figs.png";

import { useGlobalContext } from "./gobalContext";

function PageThree() {
  const { sharedState} = useGlobalContext();
  return(
    <div className="overflow-hidden">
      {/* Main content */}
      <div className="flex w-full max-w-7xl h-full border rounded-lg overflow-hidden shadow-lg bg-white">
        <div className="flex flex-col w-1/4 ">
          <h2 className="text-2xl font-bold text-#285954 px-4 pt-4">
          <p>Shared Data: {sharedState.someData}</p>
          </h2>
          <div className="dummy-content p-4">
            {" "}
            {/* <-- Added padding here */}
            <div className="py-2">
              {" "}
              {/* <-- Added vertical padding for each image component */}
              <ImageComp
                img={wind_image}
                name="Wind Speed Distribution"
              ></ImageComp>
            </div>
            <div className="py-2">
              <ImageComp
                img={pressure_image}
                name="Atmostpheric Pressure Distribution"
              ></ImageComp>
            </div>
            <div className="py-2">
              <ImageComp
                img={threeFigs}
                name="Population Density/Altitude/Woodburner Density"
              ></ImageComp>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageThree;
