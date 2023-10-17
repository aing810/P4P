import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

import csv
import argparse
import sys

# Set up the argument parser
parser = argparse.ArgumentParser(description="Process a town's weather data.")
parser.add_argument('--town', required=True, help="Name of the town to process")

# Parse the arguments
args = parser.parse_args()
town_name = args.town


# townName = 'Wellington'
# Data loading (you've already done this, so it's just for completeness)
town_pressure = pd.read_csv(f'./Metadata/{town_name}_Pressure.csv')

# Determine the global y-axis limits based on all datasets
global_max_density = np.histogram(town_pressure['Pstn(hPa)'], bins=30, density=True)[0].max()


# Determine the global x-axis limit based on the maximum wind speed from all datasets
global_max_speed = 1100  # Set the maximum x-axis limit to 1200

title_fontsize = 14
label_fontsize = 14

# Defining the colors array
colors = ['blue', 'red', 'green', 'purple']

# Plot pressure data
plt.hist(town_pressure['Pstn(hPa)'], bins=30, alpha=0.6, color=colors[0], density=True)
plt.title(f'{town_name} Atmospheric Pressure Distribution', fontsize=title_fontsize)
plt.xlabel('Pressure (hPa)', fontsize=label_fontsize)
plt.ylabel('Density', fontsize=label_fontsize)
plt.xlim(900, global_max_speed)
plt.ylim(0, global_max_density)
plt.grid(True, which='both', linestyle='--', linewidth=0.5)

# Save the pressure figure
plt.savefig(f'./GraphImages/{town_name}_Pressure.png')
plt.close()


#new plot

town_wind = pd.read_csv(f'./Metadata/{town_name}_Wind.csv')

# Combine all wind data into one list
all_wind_data = [town_wind['Speed(m/s)']]

# Determine the global y-axis limits based on all datasets
global_max_density = np.histogram(town_wind['Speed(m/s)'], bins=30, density=True)[0].max()
# Determine the global x-axis limit based on the maximum wind speed from all datasets
global_max_speed = town_wind['Speed(m/s)'].max()  # Set the maximum x-axis limit to 1200

title_fontsize = 14
label_fontsize = 14

# Defining the colors array
colors = ['blue', 'red', 'green', 'purple']

plt.figure(figsize=(10, 6))

for i, wind_data in enumerate(all_wind_data):
     plt.hist(
        wind_data, bins=30, alpha=0.6, color=colors[i], density=True,
        label=f'Dataset {i+1}', edgecolor='black'  # Adding black borders around bars
    )


# Plot wind speed data
plt.hist(town_wind['Speed(m/s)'], bins=30, alpha=0.6, color=colors[0], density=True)
plt.title(f'{town_name} Wind Speed Distribution', fontsize=title_fontsize)
plt.xlabel('Wind Speed (m/s)', fontsize=label_fontsize)
plt.ylabel('Density', fontsize=label_fontsize)
plt.xlim(0, global_max_speed)
plt.ylim(0, global_max_density)
plt.grid(True, which='both', linestyle='--', linewidth=0.5)

# Save the wind speed figure
plt.savefig(f'./GraphImages/{town_name}_Wind.png')
plt.close()