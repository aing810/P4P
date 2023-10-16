# Transfer Learning for Air Quality Inference

This repository contains code and resources for the "Transfer Learning for Air Quality Inference" project. The project is divided into two main sections: **Town Ranking Algo** and **Demo Day**.

## Town Ranking Algo

The Town Ranking Algo section includes components related to the algorithm for ranking towns based on air quality. This section comprises four main parts:

### Metadata

The metadata folder contains all the data necessary for the algorithm. The data is provided in CSV format and includes the following information:
- Wind and pressure data over the year 2020
- Discrete values of population, area, altitude, and woodburner count for each town

### Scripts

The scripts folder contains two key scripts for the algorithm:

1. `calculate_rankings.py`: This script is used to run our algorithm, which calculates town rankings based on the data defined in our paper. Additionally, it can incorporate data for an extra town (e.g., Wellington) if provided in the same format as the original metadata files.

2. `clean_data.py`: This script is designed to clean the output from Cliflo, ensuring that the resulting file contains data from only one station and includes only pressure and wind data. It also renames the Cliflo output file to `{townname}Unprocessed.csv` for further analysis in Excel or other tools.

### UnprocessedData

The UnprocessedData folder contains the raw, unprocessed Cliflo data, which serves as the input for the ranking algorithm. This data may require cleaning and preprocessing before running the algorithm.

### backend

The backend folder houses the server for our Demo Day application. This server interacts with the front-end app and handles data requests and responses.

## Demo Day

The Demo Day section is dedicated to the front-end application of our project, developed using React. This folder contains all the necessary code and resources for the user interface and interaction with the town ranking algorithm.

---

## Data Collection and Processing

### Cliflo Data
Wind Speed and Pressure is collected from Cliflo database provided by NIWA this data is in the unprocessed data folder using cromwell as an example. For each metadata feature a single file will be downloaded included both Wind and Atmospheric Pressure data. This will be processed through processClifoData.py script.

### Discrete data
This is Alitude, Population Density, and Wood Burner Density data in the format of Population, Altitude, Wood Burner and Area. Altitude is collected from https://en-nz.topographic-map.com. Stats NZ was used to collect the population and wood burner data from https://www.stats.govt.nz/information-releases/statistical-area-1-dataset-for-2018-census-updated-march-2020#regional. Stats NZ GIS software was used to gather the data for area https://datafinder.stats.govt.nz/data/?geotag=global%2Foceania%2Fnew-zealand. These values are inputted in one file for each town in {town name}_discrete_metadata.csv.



### Algorithm code and modularity

Our code is modular therefore towns can be added dynamically given it is preprocessed as mentioned above. For adding metadata features 
