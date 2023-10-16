const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csvParser = require('csv-parser');

const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors()); // Use the cors middleware to enable CORS for all routes

// Set up Multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Rename the uploaded file based on townName and originalname
    const townName = req.body.townName;
    const originalname = file.originalname.replace(/\s+/g, '_'); // Replace spaces with underscores
    const filename = `${townName}_${originalname}`;
    cb(null, filename);
  },
});


const upload = multer({ storage });

app.post('/upload-csv', upload.fields([{ name: 'wind' }, { name: 'pressure' }]), (req, res) => {
  // Access uploaded CSV files
  const windFile = req.files['wind'] ? req.files['wind'][0] : null; // Access 'wind' file if it exists
  const pressureFile = req.files['pressure'] ? req.files['pressure'][0] : null; // Access 'pressure' file if it exists

  // Access data points and additional parameters sent from the React frontend
  const dataPoints = req.body.dataPoints;
  const townName = req.body.townName;
  const area = req.body.area;
  const population = req.body.population;
  const woodburnerCount = req.body.woodburnerCount;
  const altitude = req.body.altitude;

  // Handle CSV file parsing and saving
  const savedFiles = [];
  
  // Process 'wind.csv' file if it exists
  if (windFile) {
    const windFilePath = windFile.path;
    fs.createReadStream(windFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Process 'wind.csv' data as needed
      })
      .on('end', () => {
        console.log(`'${townName}_Wind.csv' parsed successfully.`);
        savedFiles.push(windFilePath);
      });
  }

  // Process 'pressure.csv' file if it exists
  if (pressureFile) {
    const pressureFilePath = pressureFile.path;
    fs.createReadStream(pressureFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Process 'pressure.csv' data as needed
      })
      .on('end', () => {
        console.log(`'${townName}_Pressure.csv' parsed successfully.`);
        savedFiles.push(pressureFilePath);
      });
  }

  // Process data points and additional parameters as needed

  // Send a response to the frontend
  res.status(200).json({ message: 'Data received and CSV files saved.', savedFiles });
});



app.post('/town', (req, res) => {
  const townName = req.body.town;
  if (!townName) {
    return res.status(400).send('Town name is required');
  }

  // Define the Python script path and the JSON output file path
  let scriptPath = './Scripts/newTownAddedCalled.py';

  const townArgument = '--town';
  const townInput = "\"" + townName + "\"";

  console.log(townInput);
  console.log(__dirname);

  // Check if the path exists
  fs.access(scriptPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`The path '${scriptPath}' does not exist.`);
      return res.status(500).send('Error executing the Python script');
    } else {
      console.log(`The path '${scriptPath}' exists.`);
    }

      // Call the Python script with the town name as an argument
      const pythonProcess = spawn('python', [scriptPath, townArgument, townName]);

      // Capture the stdout and stderr from the Python script
      let scriptOutput = '';
      let scriptError = '';

      pythonProcess.stdout.on('data', (data) => {
        scriptOutput += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        scriptError += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Error executing the Python script:', scriptError);
          return res.status(500).send('Error executing the Python script');
        }
        // // Define the path to your JSON file
        const filePath = './Scripts/newTownResultsObject.json';

        // Read the JSON file synchronously
        try {
          const jsonData = fs.readFileSync(filePath, 'utf8');

          // Parse the JSON data into a JavaScript object
          const jsonObject = JSON.parse(jsonData);

          // Now you have the JSON data as a JavaScript object
          console.log(jsonObject);
          // Send the captured output as a response
        res.json({ output: jsonObject });
        } catch (error) {
          console.error('Error reading or parsing the JSON file:', error);
        }

        
      });
  });
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
