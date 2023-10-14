// App.js
import React, { useState, useEffect, useRef } from 'react';
import WeightSlider from './components/WeightSlider';
import TotalLabel from './components/TotalLabel';
import L from 'leaflet';
import 'leaflet.heat'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import RankingDisplay from './components/RankingDisplay';

function App() {
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        height: '100vh',
    };

    const metrics = [
        'windSpeed',
        'atmosphericPressure',
        'altitude',
        'populationDensity',
        'woodBurnerDensity'
    ];

    const gradient = {
        0.4: 'blue',
        0.6: 'lime',
        0.7: 'yellow',
        0.8: 'orange',
        1.0: 'red'
    }

    const defaultWeights = {
        'windSpeed': 0.3125,
        'atmosphericPressure': 0.21875,
        'altitude': 0.03125,
        'populationDensity': 0.3125,
        'woodBurnerDensity': 0.125
    };
    const results = {
        "Invercargill": {
            "Cromwell": {
                "wind_score": 0.009801594005568952,
                "pressure_score": 0.010659595511681216,
                "density_score": 0.017142629387204376,
                "altitude_score": 0.9523809523809523,
                "woodburner_score": 0.02820745372643021,
                "total_score": 1.0181922250118371
            },
            "Masterton": {
                "wind_score": 0.07539834478481838,
                "pressure_score": 0.013869741536417063,
                "density_score": 0.2323579700450593,
                "altitude_score": 0.1984126984126984,
                "woodburner_score": 0.2020504667637993,
                "total_score": 0.7220892215427924
            },
            "Reefton": {
                "wind_score": 0.02933791202874373,
                "pressure_score": 0.015119790699094873,
                "density_score": 0.13066528570567998,
                "altitude_score": 0.42063492063492064,
                "woodburner_score": 0.3436260160331387,
                "total_score": 0.939383925101578
            }
        },
        "Cromwell": {
            "Invercargill": {
                "wind_score": 0.009801594005568952,
                "pressure_score": 0.010659595511681216,
                "density_score": 0.017142629387204376,
                "altitude_score": 0.9523809523809523,
                "woodburner_score": 0.02820745372643021,
                "total_score": 1.0181922250118371
            },
            "Masterton": {
                "wind_score": 0.07522248936866244,
                "pressure_score": 0.024186632790616443,
                "density_score": 0.30134574273742615,
                "altitude_score": 0.7063492063492064,
                "woodburner_score": 0.5869215065186846,
                "total_score": 1.694025577764596
            },
            "Reefton": {
                "wind_score": 0.03031406412288818,
                "pressure_score": 0.011613772582161331,
                "density_score": 0.4030384270768054,
                "altitude_score": 0.48412698412698413,
                "woodburner_score": 0.041245023721746536,
                "total_score": 0.9703382716305855
            }
        },
        "Masterton": {
            "Invercargill": {
                "wind_score": 0.07539834478481838,
                "pressure_score": 0.013869741536417063,
                "density_score": 0.2323579700450593,
                "altitude_score": 0.1984126984126984,
                "woodburner_score": 0.2020504667637993,
                "total_score": 0.7220892215427924
            },
            "Cromwell": {
                "wind_score": 0.07522248936866244,
                "pressure_score": 0.024186632790616443,
                "density_score": 0.30134574273742615,
                "altitude_score": 0.7063492063492064,
                "woodburner_score": 0.5869215065186846,
                "total_score": 1.694025577764596
            },
            "Reefton": {
                "wind_score": 0.08953179980960459,
                "pressure_score": 0.027157916149414593,
                "density_score": 0.4491536578303103,
                "altitude_score": 0.1746031746031746,
                "woodburner_score": 0.13259798931562256,
                "total_score": 0.8730445377081266
            }
        },
        "Reefton": {
            "Invercargill": {
                "wind_score": 0.02933791202874373,
                "pressure_score": 0.015119790699094873,
                "density_score": 0.13066528570567998,
                "altitude_score": 0.42063492063492064,
                "woodburner_score": 0.3436260160331387,
                "total_score": 0.939383925101578
            },
            "Cromwell": {
                "wind_score": 0.03031406412288818,
                "pressure_score": 0.011613772582161331,
                "density_score": 0.4030384270768054,
                "altitude_score": 0.48412698412698413,
                "woodburner_score": 0.041245023721746536,
                "total_score": 0.9703382716305855
            },
            "Masterton": {
                "wind_score": 0.08953179980960459,
                "pressure_score": 0.027157916149414593,
                "density_score": 0.4491536578303103,
                "altitude_score": 0.1746031746031746,
                "woodburner_score": 0.13259798931562256,
                "total_score": 0.8730445377081266
            }
        }
    };

    const townCoordinates = {
        'Invercargill': [-46.4132, 168.3538],
        'Cromwell': [-45.0382, 169.1985],
        'Masterton': [-40.9511, 175.6574],
        'Reefton': [-42.1160, 171.8687]
    };



    // const ;townCoordinates






    const mapRef = useRef(null);
    const [weights, setWeights] = useState(defaultWeights);
    const [lastChangedMetric, setLastChangedMetric] = useState(null);
    const [rankings, setRankings] = useState({});
    // State for the weighted results
    const [weightedResults, setWeightedResults] = useState({});
    const [selectedTown, setSelectedTown] = useState("Invercargill");
    const heatmapData = getHeatmapDataForTown(selectedTown);

    useEffect(() => {
        // Create a deep copy of the original results
        const deepCopy = JSON.parse(JSON.stringify(results));

        // Iterate over the deep copy to adjust metric names and apply weights
        for (let town in deepCopy) {
            for (let targetTown in deepCopy[town]) {
                let totalWeightedScore = 0;
                for (let metric in deepCopy[town][targetTown]) {
                    if (metric !== 'total_score') {
                        let weightedScore = deepCopy[town][targetTown][metric] * weights[metric];
                        deepCopy[town][targetTown][`weighted_${metric}`] = weightedScore;
                        totalWeightedScore += weightedScore;
                        delete deepCopy[town][targetTown][metric];
                    }
                }
                deepCopy[town][targetTown]['total_score'] = totalWeightedScore;
            }
        }

        // Set the adjusted copy to the state
        setWeightedResults(deepCopy);
    }, [weights]);  // Re-run the effect whenever the weights change

    const handleSliderChange = (name, value) => {
        const updatedWeights = {
            ...weights,
            [name]: value
        };
        const total = Object.values(updatedWeights).reduce((acc, val) => acc + val, 0);

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
    

    function MyMap({ town, data }) {
        const mapRef = useRef(null);

        useEffect(() => {
            calculateRanking()
            const map = L.map(mapRef.current, {
                zoomControl: false,
                scrollWheelZoom: false,
                touchZoom: false,
                doubleClickZoom: false
            }).setView(townCoordinates[town], 12);


            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            let data = []
            let heatmapData = [];
            if (selectedTown !== town) {
                console.log(town)
                console.log(weightedResults)
                let score = results[selectedTown][town].total_score;

                const [lat, lng] = townCoordinates[town];
                const coord = townCoordinates[town]
                if(score > 1){
                    score = 1
                }
                heatmapData.push([lat, lng, score]); // Adding data point to heatmapData array
                console.log(town, heatmapData)

                L.circle(coord, {
                    radius: 4000,
                    color: getColor(score),    // Border color
                    fillColor: getColor(score),  // Fill color based on the score
                    fillOpacity: 0.5    // Fill opacity
                }).addTo(map);
            }


            

            // const heatmapData = getHeatmapData(town);

            // console.log(heatmapData, "This is heatmapData")

            return () => {
                map.remove();
            };
        }, [town, data]);

        return <div ref={mapRef} style={{ width: '50vw', height: '50vh' }}></div>;
    }


    const calculateRanking = () => {
        const orderedResults = {};
        const results = {
            "Invercargill": {
                "Cromwell": {
                    "wind_score": 0.009801594005568952,
                    "pressure_score": 0.010659595511681216,
                    "density_score": 0.017142629387204376,
                    "altitude_score": 0.9523809523809523,
                    "woodburner_score": 0.02820745372643021,
                    "total_score": 1.0181922250118371
                },
                "Masterton": {
                    "wind_score": 0.07539834478481838,
                    "pressure_score": 0.013869741536417063,
                    "density_score": 0.2323579700450593,
                    "altitude_score": 0.1984126984126984,
                    "woodburner_score": 0.2020504667637993,
                    "total_score": 0.7220892215427924
                },
                "Reefton": {
                    "wind_score": 0.02933791202874373,
                    "pressure_score": 0.015119790699094873,
                    "density_score": 0.13066528570567998,
                    "altitude_score": 0.42063492063492064,
                    "woodburner_score": 0.3436260160331387,
                    "total_score": 0.939383925101578
                }
            },
            "Cromwell": {
                "Invercargill": {
                    "wind_score": 0.009801594005568952,
                    "pressure_score": 0.010659595511681216,
                    "density_score": 0.017142629387204376,
                    "altitude_score": 0.9523809523809523,
                    "woodburner_score": 0.02820745372643021,
                    "total_score": 1.0181922250118371
                },
                "Masterton": {
                    "wind_score": 0.07522248936866244,
                    "pressure_score": 0.024186632790616443,
                    "density_score": 0.30134574273742615,
                    "altitude_score": 0.7063492063492064,
                    "woodburner_score": 0.5869215065186846,
                    "total_score": 1.694025577764596
                },
                "Reefton": {
                    "wind_score": 0.03031406412288818,
                    "pressure_score": 0.011613772582161331,
                    "density_score": 0.4030384270768054,
                    "altitude_score": 0.48412698412698413,
                    "woodburner_score": 0.041245023721746536,
                    "total_score": 0.9703382716305855
                }
            },
            "Masterton": {
                "Invercargill": {
                    "wind_score": 0.07539834478481838,
                    "pressure_score": 0.013869741536417063,
                    "density_score": 0.2323579700450593,
                    "altitude_score": 0.1984126984126984,
                    "woodburner_score": 0.2020504667637993,
                    "total_score": 0.7220892215427924
                },
                "Cromwell": {
                    "wind_score": 0.07522248936866244,
                    "pressure_score": 0.024186632790616443,
                    "density_score": 0.30134574273742615,
                    "altitude_score": 0.7063492063492064,
                    "woodburner_score": 0.5869215065186846,
                    "total_score": 1.694025577764596
                },
                "Reefton": {
                    "wind_score": 0.08953179980960459,
                    "pressure_score": 0.027157916149414593,
                    "density_score": 0.4491536578303103,
                    "altitude_score": 0.1746031746031746,
                    "woodburner_score": 0.13259798931562256,
                    "total_score": 0.8730445377081266
                }
            },
            "Reefton": {
                "Invercargill": {
                    "wind_score": 0.02933791202874373,
                    "pressure_score": 0.015119790699094873,
                    "density_score": 0.13066528570567998,
                    "altitude_score": 0.42063492063492064,
                    "woodburner_score": 0.3436260160331387,
                    "total_score": 0.939383925101578
                },
                "Cromwell": {
                    "wind_score": 0.03031406412288818,
                    "pressure_score": 0.011613772582161331,
                    "density_score": 0.4030384270768054,
                    "altitude_score": 0.48412698412698413,
                    "woodburner_score": 0.041245023721746536,
                    "total_score": 0.9703382716305855
                },
                "Masterton": {
                    "wind_score": 0.08953179980960459,
                    "pressure_score": 0.027157916149414593,
                    "density_score": 0.4491536578303103,
                    "altitude_score": 0.1746031746031746,
                    "woodburner_score": 0.13259798931562256,
                    "total_score": 0.8730445377081266
                }
            }
        };

        for (let targetTown in results) {
            orderedResults[targetTown] = {};
            for (let childName in results[targetTown]) {
                let scores = results[targetTown][childName];
                scores.total_score = (
                    scores.wind_score * weights.windSpeed +
                    scores.pressure_score * weights.atmosphericPressure +
                    scores.density_score * weights.populationDensity +
                    scores.altitude_score * weights.altitude +
                    scores.woodburner_score * weights.woodBurnerDensity
                );
                console.log(scores, childName)
                orderedResults[targetTown][childName] = scores.total_score;
            }
        }

        const sortedResults = {};
        for (let targetTown in results) {
            let sortedChildDicts = Object.entries(results[targetTown]).sort((a, b) => a[1].total_score - b[1].total_score);
            sortedResults[targetTown] = sortedChildDicts.map(item => item[0]);
        }

        setRankings(sortedResults);
    };

    // Whenever any weight changes, recalculate the rankings
    const handleWeightChange = (metric, value) => {
        setWeights(prevWeights => {
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
            <select onChange={e => onChange(e.target.value)}>
                {Object.keys(results).map(town => (
                    <option key={town} value={town}>
                        {town}
                    </option>
                ))}
            </select>
        );
    }


    function getHeatmapDataForTown(selectedTown) {
        const associatedTownsScores = results[selectedTown];
        const heatmapData = Object.entries(associatedTownsScores).map(([townName, scores]) => {
            const townData = townCoordinates[townName];
            return {
                lat: townData.lat,
                lng: townData.lng,
                value: scores.total_score
            };
        });
        return heatmapData;
    }

    const getHeatmapData = (selectedTown) => {
        const data = [];
        for (let town in results[selectedTown]) {
            const score = results[selectedTown][town].total_score;
            console.log(town)
            const [lat, lng] = townCoordinates[town];
            data.push([lat, lng, score]);
        }
        return data;
    };


    // This is a custom component that adds the heatmap layer to the Leaflet map
    function HeatmapLayer({ data }) {
        const map = useMap();

        React.useEffect(() => {
            if (!map) return;

            // Create the heatmap layer
            const heatmapLayer = new window.HeatmapOverlay({
                radius: 0.5,
                maxOpacity: 0.8,
                scaleRadius: true,
                useLocalExtrema: true,
                latField: 'lat',
                lngField: 'lng',
                valueField: 'value'
            });



            // Add heatmap layer to the map
            map.addLayer(heatmapLayer);
            heatmapLayer.setData({ max: 10, data: data });  // Here max is the maximum value for total_score. Adjust accordingly.

            return () => {
                map.removeLayer(heatmapLayer);
            };
        }, [map, data]);

        return null;
    }

    return (
        <div className="app">
            {metrics.map(metric => (
                <WeightSlider
                    key={metric}
                    name={metric}
                    value={weights[metric]}
                    onChange={handleSliderChange}

                />
            ))}
            <TotalLabel total={totalWeight} />
            <button onClick={calculateRanking} disabled={totalWeight.toFixed(2) !== '1.00'}>Calculate Ranking</button>
            <button onClick={resetToDefaults}>Reset to Defaults</button>
            <RankingDisplay result={JSON.stringify(rankings)} />

            <div>
                <TownSelector onChange={setSelectedTown} />
                {/* <div id="map" ref={mapRef} style={{ width: '100vw', height: '100vh' }}></div> */}
                <div style={gridStyle}>
                    <MyMap town="Invercargill" data={results["Invercargill"]} />
                    <MyMap town="Cromwell" data={results["Cromwell"]} />
                    <MyMap town="Masterton" data={results["Masterton"]} />
                    <MyMap town="Reefton" data={results["Reefton"]} />
                </div>

            </div>

        </div>
    );
}

export default App;
