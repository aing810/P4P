import React from "react";
import { useGlobalContext } from "./gobalContext";
import CSVModal from "./components/CSVModal"
// import CromwellUnprocessed from "./resources/CromwellUnprocessed.csv"
import CromwellWind from "./resources/Cromwell_Wind.csv";
import ReeftonWind from "./resources/Reefton_Wind.csv";
import InvercargillWind from "./resources/Invercargill_Wind.csv";
import MastertonWind from "./resources/Masterton_Wind.csv";

import CromwellPressure from "./resources/Cromwell_Pressure.csv";
import ReeftonPressure from "./resources/Reefton_Pressure.csv";
import InvercargillPressure from "./resources/Invercargill_Pressure.csv";
import MastertonPressure from "./resources/Masterton_Pressure.csv";

import CromwellUnprocessed from './resources/CromwellUnprocessed.csv'

import unprocessedDataImage from './resources/UnprocessedDataImage.png'

import NewPageButton from "./components/NewPageButton";
import TextEntry from "./components/MetadataEntry";
// import CromwellPressure from "./resources/Cromwell_Pressure.csv";
// import ReeftonPressure from "./resources/Reefton_Pressure.csv";
// import InvercargillPressure from "./resources/Invercargill_Pressure.csv";
// import MastertonPressure from "./resources/Masterton_Pressure.csv";
function PageOne() {
  const { sharedState, setSharedState } = useGlobalContext();

  const handleClick = () => {
    setSharedState({ ...sharedState, someData: "Updated Data" });
  };

  return (
    <div className="overflow-hidden">
      {/* Main content */}
      <div className="flex flex-col w-full max-w-7xl h-full border rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Three columns */}
        <div className="flex w-full">
          
          {/* First column (placeholder) */}
          <div className="w-1/3">
            {/* Content for the first column can go here */}
          </div>
          
          {/* Second column with NewPageButtons and TextEntries */}
          <div className="w-1/3">
            <div className="flex items-center pr-4">
              <NewPageButton link="https://cliflo.niwa.co.nz/" text="Wind" />
              <TextEntry placeholder="Wind"/>
            </div>
            <div className="flex items-center">
              <NewPageButton link="https://cliflo.niwa.co.nz/" text="Pressure" />
              <TextEntry placeholder="Pressure"/>
            </div>

            <div className="flex items-center">
              <NewPageButton link="https://en-nz.topographic-map.com/map-wl557/New-Zealand/?center=-41.57436%2C176.61621&zoom=5&popup=-46.41514%2C168.35552" text="Altitude" />
              <TextEntry placeholder="Altitude"/>
            </div>
            {/* Additional TextEntry components without corresponding NewPageButtons */}
            <div className="flex items-center">
            <NewPageButton link="https://www.stats.govt.nz/information-releases/statistical-area-1-dataset-for-2018-census-updated-march-2020#regional" text="Population" />
              <TextEntry placeholder="Population"/>
            </div>
            <div className="flex items-center">
            <NewPageButton link="https://www.stats.govt.nz/information-releases/statistical-area-1-dataset-for-2018-census-updated-march-2020#regional" text="WoodBurner" />
              <TextEntry placeholder="Home Wood Burner Count"/>
            </div>
            <div className="flex items-center">
              <NewPageButton link="https://datafinder.stats.govt.nz/data/?geotag=global%2Foceania%2Fnew-zealand" text="Area" />
              <TextEntry placeholder="Area"/>
            </div>
          </div>

          {/* Third column (you can decide its content) */}
          <div className="w-1/3">
            {/* Content for the third column can go here */}
          </div>
          <button >Submit Data</button>

        </div>
      </div>
    </div>
  );
}

export default PageOne;
