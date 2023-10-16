import React from "react";
import { useGlobalContext } from "./gobalContext";

function PageOne() {
  const { sharedState, setSharedState } = useGlobalContext();
  const handleClick = () => {
    setSharedState({ ...sharedState, someData: "Updated Data" });
  };
  return (
    <div className="overflow-hidden">
      {/* Main content */}
      <div className="flex w-full max-w-7xl h-full border rounded-lg overflow-hidden shadow-lg bg-white">
        <h2>Page One</h2>
        <p>Shared Data: {sharedState.someData}</p>
        <button onClick={handleClick}>Update Data</button>
      </div>
    </div>
  );
}

export default PageOne;
