import React, { createContext, useContext, useEffect, useState } from "react";

// Create a new context
const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
  const [townsList, setTownsList] = useState(["Invercargill", "Cromwell", "Masterton", "Reefton"]);
  const [sharedState, setSharedState] = useState({}); // Initialize your shared state here
  const [results, setResults] = useState({
    Invercargill: {
      Cromwell: {
        wind_score: 0.009801594005568952,
        pressure_score: 0.010659595511681216,
        density_score: 0.017142629387204376,
        altitude_score: 0.9523809523809523,
        woodburner_score: 0.02820745372643021,
        total_score: 1.0181922250118371,
      },
      Masterton: {
        wind_score: 0.07539834478481838,
        pressure_score: 0.013869741536417063,
        density_score: 0.2323579700450593,
        altitude_score: 0.1984126984126984,
        woodburner_score: 0.2020504667637993,
        total_score: 0.7220892215427924,
      },
      Reefton: {
        wind_score: 0.02933791202874373,
        pressure_score: 0.015119790699094873,
        density_score: 0.13066528570567998,
        altitude_score: 0.42063492063492064,
        woodburner_score: 0.3436260160331387,
        total_score: 0.939383925101578,
      },
    },
    Cromwell: {
      Invercargill: {
        wind_score: 0.009801594005568952,
        pressure_score: 0.010659595511681216,
        density_score: 0.017142629387204376,
        altitude_score: 0.9523809523809523,
        woodburner_score: 0.02820745372643021,
        total_score: 1.0181922250118371,
      },
      Masterton: {
        wind_score: 0.07522248936866244,
        pressure_score: 0.024186632790616443,
        density_score: 0.30134574273742615,
        altitude_score: 0.7063492063492064,
        woodburner_score: 0.5869215065186846,
        total_score: 1.694025577764596,
      },
      Reefton: {
        wind_score: 0.03031406412288818,
        pressure_score: 0.011613772582161331,
        density_score: 0.4030384270768054,
        altitude_score: 0.48412698412698413,
        woodburner_score: 0.041245023721746536,
        total_score: 0.9703382716305855,
      },
    },
    Masterton: {
      Invercargill: {
        wind_score: 0.07539834478481838,
        pressure_score: 0.013869741536417063,
        density_score: 0.2323579700450593,
        altitude_score: 0.1984126984126984,
        woodburner_score: 0.2020504667637993,
        total_score: 0.7220892215427924,
      },
      Cromwell: {
        wind_score: 0.07522248936866244,
        pressure_score: 0.024186632790616443,
        density_score: 0.30134574273742615,
        altitude_score: 0.7063492063492064,
        woodburner_score: 0.5869215065186846,
        total_score: 1.694025577764596,
      },
      Reefton: {
        wind_score: 0.08953179980960459,
        pressure_score: 0.027157916149414593,
        density_score: 0.4491536578303103,
        altitude_score: 0.1746031746031746,
        woodburner_score: 0.13259798931562256,
        total_score: 0.8730445377081266,
      },
    },
    Reefton: {
      Invercargill: {
        wind_score: 0.02933791202874373,
        pressure_score: 0.015119790699094873,
        density_score: 0.13066528570567998,
        altitude_score: 0.42063492063492064,
        woodburner_score: 0.3436260160331387,
        total_score: 0.939383925101578,
      },
      Cromwell: {
        wind_score: 0.03031406412288818,
        pressure_score: 0.011613772582161331,
        density_score: 0.4030384270768054,
        altitude_score: 0.48412698412698413,
        woodburner_score: 0.041245023721746536,
        total_score: 0.9703382716305855,
      },
      Masterton: {
        wind_score: 0.08953179980960459,
        pressure_score: 0.027157916149414593,
        density_score: 0.4491536578303103,
        altitude_score: 0.1746031746031746,
        woodburner_score: 0.13259798931562256,
        total_score: 0.8730445377081266,
      },
    },
  }); // Initialize your shared state here

  const Aresults = {
    Invercargill: {
      Cromwell: {
        wind_score: 0.009801594005568952,
        pressure_score: 0.010659595511681216,
        density_score: 0.017142629387204376,
        altitude_score: 0.9523809523809523,
        woodburner_score: 0.02820745372643021,
        total_score: 1.0181922250118371,
      },
      Masterton: {
        wind_score: 0.07539834478481838,
        pressure_score: 0.013869741536417063,
        density_score: 0.2323579700450593,
        altitude_score: 0.1984126984126984,
        woodburner_score: 0.2020504667637993,
        total_score: 0.7220892215427924,
      },
      Reefton: {
        wind_score: 0.02933791202874373,
        pressure_score: 0.015119790699094873,
        density_score: 0.13066528570567998,
        altitude_score: 0.42063492063492064,
        woodburner_score: 0.3436260160331387,
        total_score: 0.939383925101578,
      },
    },
    Cromwell: {
      Invercargill: {
        wind_score: 0.009801594005568952,
        pressure_score: 0.010659595511681216,
        density_score: 0.017142629387204376,
        altitude_score: 0.9523809523809523,
        woodburner_score: 0.02820745372643021,
        total_score: 1.0181922250118371,
      },
      Masterton: {
        wind_score: 0.07522248936866244,
        pressure_score: 0.024186632790616443,
        density_score: 0.30134574273742615,
        altitude_score: 0.7063492063492064,
        woodburner_score: 0.5869215065186846,
        total_score: 1.694025577764596,
      },
      Reefton: {
        wind_score: 0.03031406412288818,
        pressure_score: 0.011613772582161331,
        density_score: 0.4030384270768054,
        altitude_score: 0.48412698412698413,
        woodburner_score: 0.041245023721746536,
        total_score: 0.9703382716305855,
      },
    },
    Masterton: {
      Invercargill: {
        wind_score: 0.07539834478481838,
        pressure_score: 0.013869741536417063,
        density_score: 0.2323579700450593,
        altitude_score: 0.1984126984126984,
        woodburner_score: 0.2020504667637993,
        total_score: 0.7220892215427924,
      },
      Cromwell: {
        wind_score: 0.07522248936866244,
        pressure_score: 0.024186632790616443,
        density_score: 0.30134574273742615,
        altitude_score: 0.7063492063492064,
        woodburner_score: 0.5869215065186846,
        total_score: 1.694025577764596,
      },
      Reefton: {
        wind_score: 0.08953179980960459,
        pressure_score: 0.027157916149414593,
        density_score: 0.4491536578303103,
        altitude_score: 0.1746031746031746,
        woodburner_score: 0.13259798931562256,
        total_score: 0.8730445377081266,
      },
    },
    Reefton: {
      Invercargill: {
        wind_score: 0.02933791202874373,
        pressure_score: 0.015119790699094873,
        density_score: 0.13066528570567998,
        altitude_score: 0.42063492063492064,
        woodburner_score: 0.3436260160331387,
        total_score: 0.939383925101578,
      },
      Cromwell: {
        wind_score: 0.03031406412288818,
        pressure_score: 0.011613772582161331,
        density_score: 0.4030384270768054,
        altitude_score: 0.48412698412698413,
        woodburner_score: 0.041245023721746536,
        total_score: 0.9703382716305855,
      },
      Masterton: {
        wind_score: 0.08953179980960459,
        pressure_score: 0.027157916149414593,
        density_score: 0.4491536578303103,
        altitude_score: 0.1746031746031746,
        woodburner_score: 0.13259798931562256,
        total_score: 0.8730445377081266,
      },
    },
  };

  useEffect(() => {
    console.log('results updated', results)
  }
  , [results])
  
  return (
    <GlobalContext.Provider value={{ sharedState, setSharedState, results, townsList, setResults, setTownsList }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Create a custom hook to access the context
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
