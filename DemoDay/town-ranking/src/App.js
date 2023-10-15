// App.js
import React, { useRef } from "react";
import PageOne from "./pageOne";
import PageTwo from "./pageTwo";
import PageThree from "./pageThree";
import ScrollComponent from "./components/ScrollComponent";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

function App() {
  const scrollCompRef = useRef(null);
  const pages = [
    <div>
      <PageOne></PageOne>
    </div>,
    <div>
      <PageTwo></PageTwo>
    </div>,
    <div>
      <PageThree></PageThree>
    </div>,
  ];
  const handleScroll = (direction) => {
    if (scrollCompRef.current) {
      if (direction === "next") {
        scrollCompRef.current.scrollRight();
      } else {
        scrollCompRef.current.scrollLeft();
      }
    }
  };

  return (
    <div className="app flex flex-col items-center h-screen p-4 bg-gray-100 font-sans overflow-x-hidden overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 border-b-4 border-#285954 pb-2">
        Optimising Source Domain Selection for Transfer Learning in Air Quality
        Prediction
      </h1>
      <div className="relative max-w-7xl w-full flex justify-between items-center p-4">
        {" "}
        {/* Increased padding */}
        {/* Arrows are now part of the main flow, not positioned absolutely relative to the scrollable component */}
        <button
          className="focus:outline-none z-10"
          onClick={() => handleScroll("prev")}
        >
          <FaArrowLeft className="text-3xl text-black" />
        </button>
        {/* This div hides overflow and contains the scrollable component */}
        <div
          className="overflow-hidden flex-grow p-4"
          style={{ minHeight: "500px" }}
        >
          {" "}
          {/* Set minimum height and added padding */}
          <ScrollComponent ref={scrollCompRef} pages={pages} />
        </div>
        <button
          className="focus:outline-none z-10"
          onClick={() => handleScroll("next")}
        >
          <FaArrowRight className="text-3xl text-black" />
        </button>
      </div>
    </div>
  );
}
export default App;
