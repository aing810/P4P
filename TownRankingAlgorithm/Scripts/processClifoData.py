import csv

# User input for input file path
name = input("Enter the input CSV town name in unprocessed data insure format townnameUnprocessed.csv: ")
# Input file path
input_file = f'./UnprocessedData/ClifoOutput/{name}Unprocessed.csv'

# Output file paths
wind_output_file = f'./Metadata/ProcessedFromScript/{name}_Wind.csv'
pressure_output_file = f'./Metadata/ProcessedFromScript/{name}_Pressure.csv'

# Create separate lists for wind and pressure data
wind_data = []
pressure_data = []


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