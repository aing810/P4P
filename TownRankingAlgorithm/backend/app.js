const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors()); // Use the cors middleware to enable CORS for all routes


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
