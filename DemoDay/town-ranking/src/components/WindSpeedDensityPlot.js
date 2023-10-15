import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';

const WindSpeedDensityPlot = () => {
  const [densityData, setDensityData] = useState(null);

  useEffect(() => {
    // Define the towns and colors for the plots
    const towns = ['Cromwell', 'Invercargill', 'Masterton', 'Reefton'];
    const colors = ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'];
    const densityDataSets = [];

    // Function to calculate density
    const calculateDensity = (values, binSize) => {
      // Sort the values and find the range
      values.sort((a, b) => a - b);
      const min = values[0];
      const max = values[values.length - 1];

      // Create bins
      const bins = Array.from({ length: Math.ceil((max - min) / binSize) + 1 }, () => 0);

      // Fill bins
      values.forEach(value => {
        const index = Math.floor((value - min) / binSize);
        bins[index] += 1;
      });

      // Convert counts to densities
      const totalArea = values.length * binSize; // total area under the density curve must be 1
      const densities = bins.map(count => count / totalArea);

      return { densities, min, max };
    };

    // Function to process each CSV file
    const processData = (town, colorIndex) => {
      Papa.parse(`./resources/${town}_Wind.csv`, {
        download: true,
        header: true,
        complete: function (result) {
          console.log(`Raw data for ${town}:`, result.data);
          const values = result.data.map(row => parseFloat(row['Speed(m/s)'])).filter(speed => !isNaN(speed));
          const binSize = 1; // Adjust bin size as needed

          // Calculate density
          const { densities, min, max } = calculateDensity(values, binSize);

          // Construct dataset for the chart
          const dataSet = {
            label: town,
            data: densities,
            minDomain: min, // custom property to hold the domain of this dataset
            maxDomain: max, // custom property to hold the domain of this dataset
            backgroundColor: colors[colorIndex],
            borderColor: colors[colorIndex],
            borderWidth: 1,
          };

          densityDataSets.push(dataSet);

          // If all towns have been processed, set the chart data
          if (densityDataSets.length === towns.length) {
            setDensityData({
              labels: Array.from({ length: densities.length }, (_, i) => min + i * binSize), // generate bin labels
              datasets: densityDataSets,
            });
          }
        }
      });
    };

    // Process data for each town
    towns.forEach((town, index) => {
      processData(town, index);
    });
  }, []);

  // Render loading indicator if data is not ready
  if (!densityData) {
    return <div>Loading...</div>;
  }

  // Render the chart
  return (
    <div>
      <h3>Wind Speed Density Plot</h3>
      <Bar data={densityData} options={{
        scales: {
          y: {
            beginAtZero: true
          }
        },
        // additional configuration for the chart can be added here
      }} />
    </div>
  );
};

export default WindSpeedDensityPlot;
