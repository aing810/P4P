import React from "react";
import { useState } from "react";
import { useGlobalContext } from "./gobalContext";
import CSVModal from "./components/CSVModal"
import CSVFileUploader from "./components/CSVFileUploader"
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
import ImageComp from "./components/ImageComp";

import { Chart, registerables } from 'chart.js';
import Papa from 'papaparse'; // for CSV parsing

import InfoIcon from '@mui/icons-material/Info';

import wind_image from "./resources/distImages/Wellington_Wind.png";
import pressure_image from "./resources/distImages/Wellington_Pressure.png";


function PageOne() {

  const { sharedState, setSharedState, setResults,  setTownsList, townsList } = useGlobalContext();

  const [uploadedWindFile, setUploadedWindFile] = useState(null);

  const [uploadedPressureFile, setUploadedPressureFile] = useState(null);

  const [uploadedData, setUploadedData] = useState(null);

  const [csvWindData, setCsvWindData] = useState(null);
  const [csvPressureData, setCsvPressureData] = useState(null);
  const [windChart, setWindChart] = useState(null);
  const [pressureChart, setPressureChart] = useState(null);

  const [townPressureImage, setTownPressureImage] = useState(null);
  const [townWindImage, setTownWindImage] = useState(null);


  // const [csvPressureData, setPressureCsvData] = useState(null); // Store parsed CSV data
  // const [pressureChart, setPressureChart] = useState(null);


  // This effect will handle the file parsing once the file is set
  // useEffect(() => {
  //   if (uploadedWindFile) {
  //     // Parse the CSV file
  //     Papa.parse(uploadedWindFile, {
  //       complete: function (results) {
  //         // 'results' is an object with 'data' and 'errors'.
  //         // You could do error handling based on 'errors'.
  //         // Now, we will prepare data for the histogram.
  //         const speeds = results.data.map(row => parseFloat(row['Speed(m/s)'])); // assuming the column name is 'Speed(m/s)'
  //         const dataForHistogram = prepareDataForHistogram(speeds);
  //         drawHistogram(dataForHistogram);
  //       },
  //       header: true, // Consider the first row as headers
  //     });
  //   }
  // }, [uploadedWindFile]);

  const handleClick = () => {
    setSharedState({ ...sharedState, someData: "Updated Data" });
  };
  const handleWindCSVUpload = (file) => {
    setUploadedWindFile(file);
    // Parse the CSV file on upload and store the data
    Papa.parse(file, {
      complete: function (results) {
        setCsvWindData(results.data); // Store the parsed CSV data in state
        console.log('CSV wind data:', results.data)
      },
      header: true, // Consider the first row as headers
    });

  };

  const handlePressureCSVUpload = (file) => {
    setUploadedPressureFile(file);

    // Parse the CSV file on upload and store the data
    Papa.parse(file, {
      complete: function (results) {
        setCsvPressureData(results.data); // Store the parsed CSV data in state
        console.log('CSV Pressure data:', results.data)
      },
      header: true, // Consider the first row as headers
    });

  };

  const handleUnprocessedData = (file) => {
    console.log("Unprocessed Data")
    setUploadedData(file)
  }

  const handlePreProcess = () => {
    console.log("Preprocessing")
    if (uploadedData) {
      const formData = new FormData();
      formData.append("unprocessedData", uploadedData);
      formData.append("townName", "Cromwell")
      // Send the formData to your API using a fetch or axios request
      // Example using fetch:
      fetch("http://localhost:4000/process-weather-data", {
        method: "POST",
        body: formData,
      }).then(response => {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
        .then(blob => {
          // Create a new URL for the blob
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'preprocessed_weather_data.zip'; // you can name the file here
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove();  //afterwards we remove the element again         
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        })
    }
  }

  const handleDataCSVUpload = (file) => {
    setUploadedData(file);

  };

  // Function to handle form submission and send the file to an API
  const handleSubmit = () => {
    console.log("Submitted")
    console.log("Wind File:", uploadedWindFile)
    console.log("Pressure File:", uploadedPressureFile)
    if (uploadedWindFile && uploadedPressureFile) {
      // You can access the uploaded file (uploadedFile) here and send it to your API
      // For example:
      const formData = new FormData();
      formData.append("wind", uploadedWindFile);
      formData.append("pressure", uploadedPressureFile)

      // Send the formData to your API using a fetch or axios request
      // Example using fetch:
      fetch("http://localhost:4000/upload-csv", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API response:", data);
          // Handle the API response as needed
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      setTownPressureImage(pressure_image)
      setTownWindImage(wind_image)
      let ApiBody = { "townName": "Wellington" }
      let sendReqBody = JSON.stringify(ApiBody)
      fetch("http://localhost:4000/town", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ town: 'Wellington' }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API response:", data);
          // Handle the API response as needed
          const innerObject = data.output;
          setResults(innerObject)
          console.log("Output: endpoint formatted", innerObject)
          // setResults(data)
          setTownsList(prevTownsList => [...prevTownsList, "Wellington"]);

        })
        .catch((error) => {
          console.error("Error:", error);
        });

    }
    // After submission logic, prepare data for the histograms if CSV data is available
  };




  return (
    <div className="overflow-hidden">
      {/* Main content */}
      <div className="flex w-full max-w-7xl h-full border rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Header or any global page element similar to PageTwo */}
        <div className="p-4 text-left">
          <a href="https://github.com/aing810/P4P" target="_blank" rel="noopener noreferrer" aria-label="Link to the repository">
            <InfoIcon style={{ cursor: 'pointer' }} />
          </a>
        </div>

        <div className="flex w-full">
          {/* First column for Preprocess Data and other data */}
          <div className="w-1/3 border-r p-4 space-y-4"> {/* Adjusted styling */}
            <h2 className="text-2xl font-bold text-#285954">Preprocess Data</h2>
            {/* CSV File uploader for preprocessing */}
            <CSVFileUploader onUpload={handleUnprocessedData} id="preprocessFileUpload" />
            <button onClick={handlePreProcess} className="bg-[#285954] text-gray-100 px-4 py-2 rounded hover:bg-#1f4a45 transition duration-300">
              Preprocess Data
            </button>
            {/* Additional content below preprocessing */}
            <div className="mt-8 space-y-4"> {/* Adjusted styling */}
              <h2 className="text-2xl font-bold text-#285954">Add New Town</h2>
              <div className="flex flex-col space-y-2"> {/* Container for the label and input field */}
                <label htmlFor="townName" className="text-lg font-medium text-#285954">Town Name:</label> {/* Label for the input field */}
                <input type="text" id="townName" name="townName" placeholder="Enter town name" className="border-2 border-green-600 rounded py-2 px-4 w-64" /> {/* Styled input field */}
              </div>
              <div className="flex items-center justify-between space-x-4 py-2 pr-12">
                <NewPageButton className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" link="https://cliflo.niwa.co.nz/" text="Wind" /> {/* Styled button */}
                <CSVFileUploader className="ml-auto" onUpload={handleWindCSVUpload} id="windFileUpload" />
              </div>
              <div className="flex items-center justify-between space-x-4 py-2 pr-12">
                <NewPageButton className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" link="https://cliflo.niwa.co.nz/" text="Pressure" />
                <CSVFileUploader className="ml-auto" onUpload={handlePressureCSVUpload} id="pressureFileUpload" />
              </div>
              <div className="flex items-center justify-between space-x-4 py-2 pr-12">
                <NewPageButton className="ml-auto bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" link="https://en-nz.topographic-map.com/map-wl557/New-Zealand/?center=-41.57436%2C176.61621&zoom=5&popup=-46.41514%2C168.35552" text="Altitude" />
                <TextEntry className="ml-auto" placeholder="Altitude" />
              </div>
              <div className="flex items-center justify-between space-x-4 py-2 pr-12">
                <NewPageButton className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" link="https://www.stats.govt.nz/information-releases/statistical-area-1-dataset-for-2018-census-updated-march-2020#regional" text="Population" />
                <TextEntry className="ml-auto" placeholder="Population" />
              </div>
              <div className="flex items-center justify-between space-x-4 py-2 pr-12">
                <NewPageButton className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" link="https://www.stats.govt.nz/information-releases/statistical-area-1-dataset-for-2018-census-updated-march-2020#regional" text="WoodBurner" />
                <TextEntry className="ml-auto" placeholder="Wood Burner Count" />
              </div>
              <div className="flex items-center justify-between space-x-4 py-2 pr-12">
                <NewPageButton className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" link="https://datafinder.stats.govt.nz/data/?geotag=global%2Foceania%2Fnew-zealand" text="Area" />
                <TextEntry className="ml-auto" placeholder="Area" />
              </div>
              <button onClick={handleSubmit} className="bg-[#285954] text-gray-100 px-4 py-2 rounded hover:bg-#1f4a45 transition duration-300">
                Submit Data
              </button>
            </div>
          </div>



          {/* Second and Third columns: placeholders or other content */}
          <div className="w-2/3 p-4 space-y-4"> {/* Container adjusted */}
  {townPressureImage && townWindImage && (
    <div className="flex justify-start items-center space-x-2"> {/* New styling for image container */}
      <ImageComp className="w-10 h-auto" img={townPressureImage} name="Pressure Distribution" /> {/* Smaller width */}
      <ImageComp className="w-10 h-auto" img={townWindImage} name="Wind Speed Distribution" /> {/* Smaller width */}
    </div>
  )}
</div>

        </div>

        {/* Footer or Action Section: similar to PageTwo */}
        <div className="p-4 text-center space-x-4"> {/* Adjusted styling */}


        </div>
      </div>
    </div>
  );
}

export default PageOne;
