// App.js
import React, { useRef, useState } from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import PageOne from "./pageOne";
import PageTwo from "./pageTwo";
import PageThree from "./pageThree";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const parallax = useRef();

  const scroll = (nextPage) => {
    if (parallax.current) {
      parallax.current.scrollTo(nextPage);
      setCurrentPage(nextPage);
    }
  };

  const handleNext = () => {
    const nextPage = currentPage + 1;
    if (nextPage < 3) {
      scroll(nextPage);
    }
  };

  const handlePrev = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 0) {
      scroll(prevPage);
    }
  };

  return (
    <div className="app flex flex-col items-center h-screen p-4 bg-gray-100 font-sans">
      <h1 className="text-4xl font-bold text-gray-800 border-b-4 border-#285954 pb-2">
        Optimising Source Domain Selection for Transfer Learning in Air Quality
        Prediction
      </h1>
      <div className="relative max-w-7xl w-full flex justify-between items-center p-4">
        <button className="focus:outline-none z-10" onClick={handlePrev}>
          <FaArrowLeft className="text-3xl text-black" />
        </button>
        <div
          className="overflow-hidden flex-grow relative" // This will make sure your parallax container takes full height
          style={{ minHeight: "full" }}
        >
          {/* Adding Tailwind CSS class to hide scrollbar */}
          <div className="overflow-x-hidden">
            <Parallax ref={parallax} pages={3} horizontal>
              <ParallaxLayer offset={0} speed={0.5}>
                <PageOne />
              </ParallaxLayer>
              <ParallaxLayer offset={1} speed={0.5}>
                <PageTwo />
              </ParallaxLayer>
              <ParallaxLayer offset={2} speed={0.5}>
                <PageThree />
              </ParallaxLayer>
            </Parallax>
          </div>
        </div>
        <button className="focus:outline-none z-10" onClick={handleNext}>
          <FaArrowRight className="text-3xl text-black" />
        </button>
      </div>
    </div>
  );
}

export default App;
