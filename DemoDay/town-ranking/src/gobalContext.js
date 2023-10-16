import React, { createContext, useContext, useState } from "react";

// Create a new context
const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
  const [sharedState, setSharedState] = useState({}); // Initialize your shared state here

  return (
    <GlobalContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Create a custom hook to access the context
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
