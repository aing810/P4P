import csv
import argparse
import sys

# Set up the argument parser
parser = argparse.ArgumentParser(description="Process a town's weather data.")
parser.add_argument('--town', required=True, help="Name of the town to process")

# Parse the arguments
args = parser.parse_args()
town_name = args.town

# Define the file paths
print(f'Processing data for {town_name}')
input_file = f'./uploads/{town_name}Unprocessed.csv'
wind_output_file = f'./uploads/ProcessedFromScript/{town_name}_Wind.csv'
pressure_output_file = f'./uploads/ProcessedFromScript/{town_name}_Pressure.csv'


# Flags to identify the current data section
is_wind_data = False
is_pressure_data = False

# Create lists for wind and pressure data
wind_data = []
pressure_data = []

# Read the input CSV file and separate the data
with open(input_file, 'r') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        if len(row) == 0:
            # Empty row encountered, break the loop
            break
        if row[0] == "Surface Wind: Hourly":
            is_wind_data = True
            is_pressure_data = False
        elif row[0] == "Pressure: Hourly":
            is_wind_data = False
            is_pressure_data = True
        elif is_wind_data and len(row) >= 9:
            wind_data.append(row[:9])
        elif is_pressure_data and len(row) >= 5:
            pressure_data.append(row[:5])

# Write wind data to a CSV file
with open(wind_output_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(wind_data)

# Write pressure data to a CSV file
with open(pressure_output_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(pressure_data)

print(f'Wind data saved to {wind_output_file}')
print(f'Pressure data saved to {pressure_output_file}')