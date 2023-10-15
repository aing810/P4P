// App.js
import React, { useState, useEffect, useRef } from "react";
import WeightSlider from "./components/WeightSlider";
import TotalLabel from "./components/TotalLabel";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import RankingDisplay from "./components/RankingDisplay";

function App() {
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    height: "95vh",
  };

  const metrics = [
    "wind_score",
    "pressure_score",
    "altitude_score",
    "density_score",
    "woodburner_score",
  ];

  const gradient = {
    0.4: "blue",
    0.6: "lime",
    0.7: "yellow",
    0.8: "orange",
    1.0: "red",
  };

  const defaultWeights = {
    wind_score: 0.3125,
    pressure_score: 0.21875,
    altitude_score: 0.03125,
    density_score: 0.3125,
    woodburner_score: 0.125,
  };
  const results = {
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

  const townCoordinates = {
    Invercargill: [-46.4132, 168.3538],
    Cromwell: [-45.0382, 169.1985],
    Masterton: [-40.9511, 175.6574],
    Reefton: [-42.116, 171.8687],
  };

  const mapRef = useRef(null);
  const [weights, setWeights] = useState(defaultWeights);
  const [lastChangedMetric, setLastChangedMetric] = useState(null);
  const [rankings, setRankings] = useState({});
  // State for the weighted results
  const [weightedResults, setWeightedResults] = useState({});
  const [selectedTown, setSelectedTown] = useState("Invercargill");
  const [isDataProcessed, setIsDataProcessed] = useState(false)

  const handleSliderChange = (name, value) => {
    const updatedWeights = {
      ...weights,
      [name]: value,
    };
    const total = Object.values(updatedWeights).reduce(
      (acc, val) => acc + val,
      0
    );

    if (total > 1 && lastChangedMetric) {
      const excessValue = total - 1;
      updatedWeights[lastChangedMetric] -= excessValue;
    }

    setWeights(updatedWeights);
    setLastChangedMetric(name);
  };

  function getColor(score) {
    if (score < 0.2) return "#000000";
    if (score < 0.4) return "#570000";
    if (score < 0.6) return "#ff0000";
    if (score < 0.8) return "#ffc800";
    return "#ffff00";
  }

  useEffect(() => {
    // Create a deep copy of the original results
    const deepCopy = JSON.parse(JSON.stringify(results));
    console.log(results, "ogResutls");
    console.log(deepCopy, "ogDeepCopy");
    if (weights == null) {
      console.log("null check");
    }
    // Iterate over the deep copy to adjust metric names and apply weights
    for (let town in deepCopy) {
      for (let targetTown in deepCopy[town]) {
        let totalWeightedScore = 0;
        for (let metric in deepCopy[town][targetTown]) {
          if (isNaN(weights[metric])) {

          }
          else {
            if (metric !== "total_score") {
              // let weightedScore = deepCopy[town][targetTown][metric] * weights[metric];
              // console.log('deepcopymetric', deepCopy[town][targetTown][metric])
              let deepCopyMetric = parseFloat(
                deepCopy[town][targetTown][metric]
              );
              // console.log('convertered Metric', deepCopyMetric)
              console.log(weights[metric], "w metric", deepCopyMetric, "deepcopyMetric");
              let weightedScore = deepCopyMetric * weights[metric];
              console.log("weighted Score ", weightedScore);
              deepCopy[town][targetTown][metric] = weightedScore;
              totalWeightedScore += weightedScore;
            }
          }
          deepCopy[town][targetTown]["total_score"] = totalWeightedScore;
        }
      }
      // heatmapData.push([lat, lng, score]); // Adding data point to heatmapData array
      // console.log(town, heatmapData);

      // Set the adjusted copy to the state
      setWeightedResults(deepCopy);
      // Set isDataProcessed to true once the processing is complete
      setIsDataProcessed(true);
      console.log(deepCopy, 'output');
    }
  }, [weights]);

  function MyMap({ town, data }) {
    const mapRef = useRef(null);

    useEffect(() => {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false
      }).setView(townCoordinates[town], 12);

      let heatmapData = [];
      if (selectedTown !== town) {
        const score = weightedResults[selectedTown][town].total_score;
        const [lat, lng] = townCoordinates[town];
        const green = Math.min(255, Math.floor(255 * (1 - score * 2)));
        const red = Math.min(255, Math.floor(255 * (score * 2)));
        const color = `rgb(${red}, ${green}, 0)`;

        const circle = L.circle([lat, lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.6,
          radius: 2000,
        }).addTo(map);

        let popupStr = ""
        // for (let town in weightedresults) {
          // for (let targetTown in town) {
            // for (let metric in weightedResults[town][targetTown]) {
            //   if (isNaN(weights[metric])) {
    
            //   }
                // else {



                // }

          // }

        // }

        // Attach a popup to the circle with the score
        circle.bindPopup(`Score: ${score.toFixed(2)}`);
        circle.on('mouseover', function (e) {
          this.openPopup();
        });
        circle.on('mouseout', function (e) {
          this.closePopup();
        });
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      return () => {
        map.remove();
      };
    }, [town, data]);

    return <div className ="w-[30vh] h-[30vh]" ref={mapRef}></div>;
};
 // Re-run the effect whenever the weights change

  // return <div ref={mapRef} className="w-[30vh] h-[30vh]"></div>;

  useEffect(() => {

    calculateRanking()
  }, [])

  const calculateRanking = () => {
    const orderedResults = {};
    for (let targetTown in results) {
      orderedResults[targetTown] = {};
      for (let childName in results[targetTown]) {
        let scores = results[targetTown][childName];
        scores.total_score =
          scores.wind_score * weights.wind_score +
          scores.pressure_score * weights.pressure_score +
          scores.density_score * weights.density_score +
          scores.altitude_score * weights.altitude_score +
          scores.woodburner_score * weights.woodburner_score;
        console.log(scores, childName);
        orderedResults[targetTown][childName] = scores.total_score;
      }
    }

    const sortedResults = {};
    for (let targetTown in results) {
      let sortedChildDicts = Object.entries(results[targetTown]).sort(
        (a, b) => a[1].total_score - b[1].total_score
      );
      sortedResults[targetTown] = sortedChildDicts.map((item) => item[0]);
    }

    setRankings(sortedResults);
  };

  // Whenever any weight changes, recalculate the rankings
  const handleWeightChange = (metric, value) => {
    setWeights((prevWeights) => {
      const updatedWeights = { ...prevWeights, [metric]: value };
      return updatedWeights;
    });
    calculateRanking();

  };

  const resetToDefaults = () => {
    setWeights(defaultWeights);
  };

  const totalWeight = Object.values(weights).reduce((acc, val) => acc + val, 0);

  function TownSelector({ onChange }) {
    return (
      <select onChange={(e) => onChange(e.target.value)}>
        {Object.keys(results).map((town) => (
          <option key={town} value={town}>
            {town}
          </option>
        ))}
      </select>
    );
  }

  function getHeatmapDataForTown(selectedTown) {
    const associatedTownsScores = results[selectedTown];
    const heatmapData = Object.entries(associatedTownsScores).map(
      ([townName, scores]) => {
        const townData = townCoordinates[townName];
        return {
          lat: townData.lat,
          lng: townData.lng,
          value: scores.total_score,
        };
      }
    );
    return heatmapData;
  }



  return (
    <div className="app flex h-screen p-4">
      {/* Left side: Sliders and controls */}
      <div className="flex flex-col w-1/4 space-y-4 pr-4">
        {metrics.map((metric) => (
          <WeightSlider
            key={metric}
            name={metric}
            value={weights[metric]}
            onChange={handleSliderChange}
            className="mb-2"
          />
        ))}
        <TotalLabel total={totalWeight} className="mb-2" />
        <button
          onClick={resetToDefaults}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mt-2"
        >
          Reset to Defaults
        </button>
        <div className="mt-4 ">
          <TownSelector onChange={setSelectedTown} />
        </div>
      </div>

      {/* Right side: Maps */}
      {isDataProcessed && (<div className="w-1/2 grid grid-cols-2 gap-x-4 gap-y-2 h-[50vh]">
        <div className="flex ml-auto mt-auto">
          <MyMap town="Invercargill" data={results["Invercargill"]} />
        </div>
        <div className="flex mr-auto mt-auto">
          <MyMap town="Cromwell" data={results["Cromwell"]} />
        </div>
        <div className="flex ml-auto mb-auto">
          <MyMap town="Masterton" data={results["Masterton"]} />
        </div>
        <div className="flex mr-auto mb-autov">
          <MyMap town="Reefton" data={results["Reefton"]} />
        </div>
      </div>)}
    </div>
  );
}
export default App;
