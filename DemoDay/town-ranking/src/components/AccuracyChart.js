import React, { useEffect, useState, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  

const AccuracyChart = ({ resultDetails }) => {
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null); // This reference will be used with the 'Bar' component

    useEffect(() => {
        if (!resultDetails) {
            console.error('No result details provided');
            return;
        }

        const towns = Object.keys(resultDetails);
        const correctCounts = [];
        const incorrectCounts = [];

        for (const town of towns) {
            const details = resultDetails[town];
            if (!details) {
                console.error(`No data for town: ${town}`);
                correctCounts.push(0);
                incorrectCounts.push(0);
                continue;
            }

            correctCounts.push(details.correct.length);
            incorrectCounts.push(details.incorrect.length);
        }

        const newData = {
            labels: towns,
            datasets: [
                {
                    label: 'Correct Matches',
                    data: correctCounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Incorrect Matches',
                    data: incorrectCounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        };

        setChartData(newData);

        // Cleanup function to avoid memory leaks
        return () => {
            if (chartRef.current) {
                // Accessing the chart instance and destroying it
                const chartInstance = chartRef.current.chartInstance;
                // chartInstance.destroy();
            }
        };
    }, [resultDetails]);

    if (!chartData) {
        return <div>Loading chart...</div>;
    }

    return (
      <div className="h-56 relative">
            {chartData && (
                <Bar
                    ref={chartRef} // Assigning the ref
                    data={chartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            )}
        </div>
    );
};

export default AccuracyChart;
