const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4000;

app.use(express.json());

app.post('/town', (req, res) => {
  const townName = req.body.town;
  if (!townName) {
    return res.status(400).send('Town name is required');
  }

  // Define the Python script path and the JSON output file path
  let scriptPath = '../Scripts/newTownAddedCalled.py';
  const outputPath = "../Scripts/newTownResultsObject.json"

  const townArgument = '--town';
  const townInput = "\"" + townName  + "\""
  // scriptPath = scriptPath + " " + townInput

  console.log(townInput)
  console.log(__dirname);

  // Check if the path exists
  fs.access(scriptPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`The path '${scriptPath}' does not exist.`);
    } else {
      console.log(`The path '${scriptPath}' exists.`);
    }
  });
  // Call the Python script with the town name as an argumnt
  const pythonProcess = spawn('python', [scriptPath, townArgument, townName]);

  // Pipe the Python process stdout to Node.js stdout
  pythonProcess.stdout.pipe(process.stdout);

  // Pipe the Python process stderr to Node.js stderr (optional)
  pythonProcess.stderr.pipe(process.stderr);

  process.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send('Error executing the Python script');
    }

    // After script execution, read the generated JSON file
    fs.readFile(outputPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return res.status(404).send('No data found for the specified town');
      }

      // Send the contents of the JSON file as a response
      res.json(JSON.parse(data));
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
