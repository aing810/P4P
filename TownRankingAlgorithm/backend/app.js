const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const archiver = require('archiver');

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
    // const townName = req.body.townName;
    const originalname = file.originalname.replace(/\s+/g, '_'); // Replace spaces with underscores
    const filename = `${originalname}`;
    cb(null, filename);
  },
});


const upload = multer({ storage });

app.post('/upload-csv', upload.fields([{ name: 'wind' }, { name: 'pressure' }]), (req, res) => {
  // Access uploaded CSV files
  const windFile = req.files['wind'] ? req.files['wind'][0] : null; // Access 'wind' file if it exists
  const pressureFile = req.files['pressure'] ? req.files['pressure'][0] : null; // Access 'pressure' file if it exists

  const townName = req.body.townName;
  // Prepare data for the new CSV
  const dataForNewCsv = [
    {
      population: req.body.population,
      altitude: req.body.altitude,
      woodburners: req.body.woodburnerCount, // assuming "woodburners" corresponds to "woodburnerCount"
      area: req.body.area,
    },
  ];

  // Define the path for the new CSV file and its headers
  const newCsvPath = `./uploads/${townName}_discrete_metadata.csv`; // change the directory path and file name as needed
  const csvWriter = createCsvWriter({
    path: newCsvPath,
    header: [
      { id: 'population', title: 'population' },
      { id: 'altitude', title: 'altitude' },
      { id: 'woodburners', title: 'woodburners' },
      { id: 'area', title: 'area' },
    ],
  });

  // Write data to the new CSV file
  csvWriter
    .writeRecords(dataForNewCsv)
    .then(() => {
      console.log('New CSV file created successfully.');
    })

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

app.post('/process-weather-data', upload.fields([{ name: 'unprocessedData' }]), (req, res) => {
  const townName = req.body.townName;

  if (!townName) {
    return res.status(400).send({ error: 'townName is required' });
  }

  // Define the Python script path
  const scriptPath = './Scripts/processClifloData.py';

  // Spawn a new process to run the Python script
  const process = spawn('python', [scriptPath, '--town', townName]);


  // Collect data from the script
  let scriptOutput = '';
  process.stdout.on('data', (data) => {
    scriptOutput += data.toString();
  });

  // Collect error output from the script
  let scriptError = '';
  process.stderr.on('data', (data) => {
    scriptError += data.toString();
  });
  process.on('close', (code) => {

    console.log("scriptError", scriptError)

    console.log(scriptOutput)

    // Set file paths for the generated files
    const windFilePath = path.join(__dirname, `./uploads/ProcessedFromScript/${townName}_Wind.csv`); // Adjust with your actual path
    const pressureFilePath = path.join(__dirname, `./uploads/ProcessedFromScript/${townName}_Pressure.csv`); // Adjust with your actual path

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    });

    // Send the file to the client
    res.attachment(`${townName}_weather_data.zip`); // This will ensure the file is downloaded with this filename
    archive.pipe(res);


    // Append files to the zip file. The second parameter is the filename within the archive.
    archive.file(windFilePath, { name: `${townName}_Wind.csv` });
    archive.file(pressureFilePath, { name: `${townName}_Pressure.csv` });

    // Finalize the archive (i.e., we are done appending files but streams have to finish)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize().then(() => {
      console.log("Archive finalized and data has been sent.");
    }).catch((err) => {
      console.error("Error creating archive:", err);
      res.status(500).send({ error: 'Could not create archive' });
    });
  });
});



app.post('/process-town-dist', (req, res) => {
  const townName = req.body.townName;

  if (!townName) {
    return res.status(400).send({ error: 'townName is required' });
  }

  // Define the Python script path
  const scriptPath = './Scripts/plotDist.py';

  // Spawn a new process to run the Python script
  const process = spawn('python', [scriptPath, '--town', townName]);


  // Collect data from the script
  let scriptOutput = '';
  process.stdout.on('data', (data) => {
    scriptOutput += data.toString();
  });

  // Collect error output from the script
  let scriptError = '';
  process.stderr.on('data', (data) => {
    scriptError += data.toString();
  });
  process.on('close', (code) => {

    console.log("scriptError", scriptError)

    console.log(scriptOutput)

    // Set file paths for the generated files
    const windFilePath = path.join(__dirname, `./GraphImages/${townName}_Wind.png`); // Adjust with your actual path
    const pressureFilePath = path.join(__dirname, `./GraphImages/${townName}_Pressure.png`); // Adjust with your actual path


  });
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
