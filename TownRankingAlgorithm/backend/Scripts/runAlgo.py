
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from scipy.stats import wasserstein_distance
import numpy as np
import pprint 
import argparse
import json
#     # Perform the Kolmogorov-Smirnov (KS) test between two distributions
#     ks_statistic, p_value = ks_2samp(data1, data2)

#     return ks_statistic, p_value

def earthmover_distance(data1, data2):
    # Compute the Earth Mover's distance (Wasserstein distance) between two distributions
    emd = wasserstein_distance(data1, data2)
    return emd

def difference(town1,town2,maxValue,minValue):
    """
    Normalize a given value using decimal scaling
    """
    return abs(abs(town1-town2)-minValue)/(maxValue-minValue)



def calculate_town_rankings(town_names, town_wind, town_pressure, town_density, town_altitude,town_woodburner,
                            wind_weight, pressure_weight, density_weight, altitude_weight,woodburner_weight):
    results = {}

    for target_town in town_names:
        scores = {
            source_town: (
                wind_weight * earthmover_distance(town_wind[source_town], town_wind[target_town]) +
                pressure_weight * earthmover_distance(town_pressure[source_town], town_pressure[target_town]) +
                density_weight * difference(town_density[source_town],town_density[target_town],max(town_density.values()),min(town_density.values())) +
                altitude_weight * difference(town_altitude[source_town],town_altitude[target_town],max(town_altitude.values()),min(town_altitude.values())) +
                woodburner_weight * difference(town_woodburner[source_town],town_woodburner[target_town],max(town_woodburner.values()),min(town_woodburner.values()))
                # difference(town_cars[source_town], town_cars[target_town], max(town_cars.values()),min(town_cars.values()))
                )
            for source_town in town_names if source_town != target_town
        }

        results[target_town] = sorted(scores.items(), key=lambda x: x[1])



    return results


def calculate_weightings(results):
    """
    Calculate the weighting for each score type based on the number of correct predictions, excluding 'total_score'.

    Parameters:
    results (dict): A dictionary containing the correct and incorrect counts for each score type.

    Returns:
    dict: A dictionary containing the weightings for each score type.
    """

    # Calculate the total number of correct predictions, excluding 'total_score'
    total_correct = sum([score['correct'] for score_type, score in results.items() if score_type != 'total_score'])

    # Initialize a dictionary to hold the weightings
    weightings = {}

    # Calculate the weighting for each score type, excluding 'total_score'
    for score_type, counts in results.items():
        # Skip the 'total_score'
        if score_type == 'total_score':
            continue

        correct_count = counts['correct']

        # Avoid division by zero if total_correct is 0
        if total_correct > 0:
            weight = correct_count / total_correct
        else:
            weight = 0

        weightings[score_type] = weight

    return weightings



def calculate_detailed_isolated_rankings_direct(town_names, town_wind, town_pressure, town_density, town_altitude, town_woodburner):
    """
    Calculate scores for each town compared to every other, isolating each feature, without using a combined town_features dictionary.

    :param town_names: List of all town names.
    :param town_wind: Dictionary with wind data for all towns.
    :param town_pressure: Dictionary with pressure data for all towns.
    :param town_density: Dictionary with density data for all towns.
    :param town_altitude: Dictionary with altitude data for all towns.
    :param town_woodburner: Dictionary with woodburner data for all towns.
    :return: Dictionary containing detailed results.
    """
    # List of features
    features = ["wind", "pressure", "density", "altitude", "woodburner"]

    # Store the results for each town's comparisons.
    all_results = {town: {} for town in town_names}

    for target_town in town_names:
        for compared_town in town_names:
            if target_town != compared_town:
                comparison_scores = {f"{feature}_score": 0 for feature in features}  # Initialize scores

                for feature in features:
                    # Determine which data dictionary to use based on the current feature.
                    if feature == "wind":
                        data = town_wind
                    elif feature == "pressure":
                        data = town_pressure
                    elif feature == "density":
                        data = town_density
                    elif feature == "altitude":
                        data = town_altitude
                    elif feature == "woodburner":
                        data = town_woodburner

                    # Calculate the score component for this feature.
                    if feature in ["wind", "pressure"]:  # These use the earthmover_distance function.
                        score = earthmover_distance(data[target_town], data[compared_town])
                    else:  # Other features use the difference function.
                        max_value = max(data.values())
                        min_value = min(data.values())
                        score = difference(data[target_town], data[compared_town], max_value, min_value)

                    comparison_scores[f"{feature}_score"] = score  # Assign the calculated score

                # Sum all the individual feature scores to get the total score for this comparison.
                comparison_scores["total_score"] = sum(comparison_scores.values())

                # Add this comparison to the results.
                all_results[target_town][compared_town] = comparison_scores

    return all_results  # This dictionary contains the detailed results for each town comparison.




def generate_feature_rankings(detailed_results):
    feature_rankings = {}

    for feature in detailed_results[next(iter(detailed_results))]:  # Extract feature names from the first town's data.
        feature_rankings[feature] = {}

        for town, comparisons in detailed_results.items():
            # Create a list of (compared_town, score) pairs for the current feature
            scored_comparisons = [(compared_town, scores[feature]) for compared_town, scores in comparisons.items()]

            # Sort the towns based on the scores in ascending order.
            sorted_comparisons = sorted(scored_comparisons, key=lambda x: x[1])  # For ascending order, or use reverse=True for descending.

            # Extracting only the town names after sorting.
            feature_rankings[feature][town] = [compared_town for compared_town, score in sorted_comparisons]

    return feature_rankings




# Generate the feature-specific rankings.
# feature_rankings = generate_feature_rankings(weightingsOutput)

# Create the ranking objects.
# ranking_objects = create_ranking_objects(feature_rankings)


def restructure_data(data):
    # Initialize a dictionary to hold the restructured data
    scores_by_type = {
        'wind_score': {},
        'pressure_score': {},
        'density_score': {},
        'altitude_score': {},
        'woodburner_score': {},
        'total_score': {},
    }

    # Iterate through the original data to populate the new structure
    for city, destinations in data.items():
        for destination, scores in destinations.items():
            for score_type, score in scores.items():
                if score_type in scores_by_type:
                    # Check if the city is already in our new structure; if not, add it
                    if city not in scores_by_type[score_type]:
                        scores_by_type[score_type][city] = []

                    # Under each city, we'll assign the destination and score
                    scores_by_type[score_type][city].append((destination, score))

    # Now we sort the scores for each city under each score type
    for score_type, cities in scores_by_type.items():
        for city, scores in cities.items():
            scores.sort(key=lambda x: x[1])  # Sort by score

    return scores_by_type

def extract_rankings(restructured_data):
    # Extracting the rankings from the restructured data
    rankings_by_score_type = {
        score_type: {city: [dest[0] for dest in scores]
                     for city, scores in cities.items()}
        for score_type, cities in restructured_data.items()
    }
    return rankings_by_score_type

def process_data_for_rankings(data):
    # Restructure the data and sort it internally
    restructured = restructure_data(data)
    
    # Extract rankings; they are already sorted by score because of 'restructure_data'
    rankings_by_score_type = extract_rankings(restructured)
    
    # Return both restructured data and rankings
    return restructured, rankings_by_score_type



 # Process the data to get restructured data and rankings



def compare_with_ground_truth(rankings, ground_truth):
    """
    Compare ranking predictions with ground truth data.

    Parameters:
    rankings (dict): A dictionary containing ranking predictions.
    ground_truth (dict): A dictionary containing the actual rankings.

    Returns:
    dict: A dictionary with the number of correct and incorrect predictions for each score type.
    """

    # Initialize the structure for the comparison results
    comparison_results = {}

    for score_type, cities_ranking in rankings.items():
        # Initialize counters for each score type
        correct_count = 0
        incorrect_count = 0

        for city, ranking in cities_ranking.items():
            # Get the ground truth for the city
            true_ranking = ground_truth.get(city, [])

            # Compare the rankings with the ground truth
            for i, ranked_city in enumerate(ranking):
                if i < len(true_ranking) and ranked_city == true_ranking[i]:
                    correct_count += 1
                else:
                    incorrect_count += 1

        # Store the comparison results for the score type
        comparison_results[score_type] = {
            'correct': correct_count,
            'incorrect': incorrect_count
        }

    return comparison_results




def add_new_town_data(new_town_name, file_path_template, town_names, town_wind, town_pressure, town_woodburner, town_altitude, town_density, WindWeight, PressureWeight, PopDensityWeight, AltitudeWeight, WoodBurnerWeight):
    """
    Load data for a new town and add it to the existing town data structures.

    :param new_town_name: String, the name of the new town.
    :param file_path_template: String, the file path template used to locate the data files.
    :param town_names: List, the names of the towns.
    :param town_wind: Dictionary, contains wind data for the towns.
    :param town_pressure: Dictionary, contains pressure data for the towns.
    :param town_woodburner: Dictionary, contains woodburner data for the towns.
    :param town_altitude: Dictionary, contains altitude data for the towns.
    :param town_density: Dictionary, contains density data for the towns.
    """
    # Check if town already exists
    if new_town_name in town_names:
        print(f"Town {new_town_name} already exists.")
        return

    print(f"Adding {new_town_name} to the dataset...")

    # Append the new town's name to the list of towns
    town_names.append(new_town_name)

    # ... [rest of your existing code for loading data] ...

    print(f"{new_town_name} added successfully.")

    print(f"Loading data for {new_town_name}...")

    # Load and process wind data
    file_path = file_path_template.format(new_town_name, "Wind")
    df = pd.read_csv(file_path)
    wind_data = df['Speed(m/s)'].dropna()
    scaler_wind = MinMaxScaler()
    normalized_wind_data = scaler_wind.fit_transform(wind_data.values.reshape(-1, 1)).flatten()
    town_wind[new_town_name] = normalized_wind_data

    # Load and process pressure data
    file_path = file_path_template.format(new_town_name, "Pressure")
    df = pd.read_csv(file_path)
    pressure_data = df['Pstn(hPa)'].dropna()
    scaler_pressure = MinMaxScaler()
    normalized_pressure_data = scaler_pressure.fit_transform(pressure_data.values.reshape(-1, 1)).flatten()
    town_pressure[new_town_name] = normalized_pressure_data

    # Load and process discrete metadata
    file_path = file_path_template.format(new_town_name, "discrete_metadata")
    df = pd.read_csv(file_path)
    town_altitude[new_town_name] = df['altitude'].iloc[0]
    town_area = df['area'].iloc[0]
    population_density = df['population'].iloc[0] / town_area
    woodburners_per_area = df["woodburners"].iloc[0] / town_area
    town_density[new_town_name] = population_density
    town_woodburner[new_town_name] = woodburners_per_area

    print(f"Data for {new_town_name} has been loaded and processed.")

    result_rankings = calculate_town_rankings(town_names, town_wind, town_pressure, town_density, town_altitude,town_woodburner,
                                              WindWeight, PressureWeight, PopDensityWeight, AltitudeWeight, WoodBurnerWeight)
    # pprint.pprint(result_rankings)

    for target_town, rankings in result_rankings.items():
        print(f"Ranking of source towns for target town '{target_town}':")
        for rank, (source_town, score) in enumerate(rankings, start=1):
            print(f"{rank}. {source_town} (Score: {score:.4f})")
        print("\n")

    newUnweightedObject = calculate_detailed_isolated_rankings_direct(town_names, town_wind, town_pressure, town_density, town_altitude, town_woodburner)
    
    pprint.pprint(newUnweightedObject)
        # Specify the file name
    output_file = './Scripts/newTownResultsObject.json'

    # Writing to a JSON file
    with open(output_file, 'w') as json_file:
        json.dump(newUnweightedObject, json_file, indent=4)




        # break

def main_function():
    ground_truth = {
        'Invercargill': ['Cromwell', 'Reefton', 'Masterton'],
        'Cromwell': ['Invercargill', 'Reefton', 'Masterton'],
        'Masterton': ['Invercargill', 'Cromwell', 'Reefton'],
        'Reefton': ['Invercargill', 'Cromwell', 'Masterton']
    }


    town_names = ['Invercargill', 'Cromwell', 'Masterton', 'Reefton']
    #'Mangere', 'Wellington'
    #Path to dataset
    file_path_template = './Metadata/{}_{}.csv'

    town_wind = {}
    town_pressure = {}
    town_woodburner = {}
    town_altitude = {}
    town_density = {}
    # Load the data for each town
    for town in town_names:
        file_path = file_path_template.format(town, "Wind")
        df = pd.read_csv(file_path)
        town_wind[town] = df['Speed(m/s)'].dropna()

        # Normalize wind speed data using Min-Max normalization to range [0, 1]
        scaler_wind = MinMaxScaler()
        town_wind[town] = scaler_wind.fit_transform(town_wind[town].values.reshape(-1, 1)).flatten()

        file_path = file_path_template.format(town, "Pressure")
        df = pd.read_csv(file_path)
        town_pressure[town] = df['Pstn(hPa)'].dropna()

        file_path = file_path_template.format(town, "discrete_metadata")
        df = pd.read_csv(file_path)
        town_altitude[town] = df['altitude'].iloc[0]
        town_area = df['area'].iloc[0]
        town_density[town] = df['population'].iloc[0] / town_area
        town_woodburner[town] = df["woodburners"].iloc[0] / town_area

        # Normalize pressure data using Min-Max normalization to range [0, 1]
        scaler_pressure = MinMaxScaler()
        town_pressure[town] = scaler_pressure.fit_transform(town_pressure[town].values.reshape(-1, 1)).flatten()




    weightingsOutput = calculate_detailed_isolated_rankings_direct(town_names, town_wind, town_pressure, town_density, town_altitude, town_woodburner)

    restructured_data, rankings_by_score_type = process_data_for_rankings(weightingsOutput)

    # Call the function with the appropriate data
    results = compare_with_ground_truth(rankings_by_score_type, ground_truth)

    pprint.pprint(weightingsOutput)


    # Call the function with the comparison results
    weightings = calculate_weightings(results)


    # Round the weights to 4 decimal places
    AltitudeWeight = round(weightings["altitude_score"], 4)
    WindWeight = round(weightings["wind_score"], 4)
    PressureWeight = round(weightings["pressure_score"], 4)
    WoodBurnerWeight = round(weightings["woodburner_score"], 4)
    PopDensityWeight = round(weightings["density_score"], 4)
    # Print the weights and their types

    result_rankings = calculate_town_rankings(town_names, town_wind, town_pressure, town_density, town_altitude,town_woodburner,
                                                WindWeight, PressureWeight, PopDensityWeight, AltitudeWeight, WoodBurnerWeight)

    # pprint.pprint(result_rankings)

    for target_town, rankings in result_rankings.items():
        print(f"Ranking of source towns for target town '{target_town}':")
        for rank, (source_town, score) in enumerate(rankings, start=1):
            print(f"{rank}. {source_town} (Score: {score:.4f})")
        print("\n")


    # Create the parser
    parser = argparse.ArgumentParser(description='Process some town data.')

    # Declare an argument (--town), type of the argument (str), and a help description.
    parser.add_argument('--town', type=str, help='The name of the town to process')

    # Parse the arguments
    args = parser.parse_args()

    # Check if the town was provided
    if args.town:
                print(args.town)
                # Try to add the new town
                add_new_town_data(args.town, file_path_template, town_names, town_wind, town_pressure, town_woodburner, town_altitude, town_density, WindWeight, PressureWeight, PopDensityWeight, AltitudeWeight, WoodBurnerWeight)
    else:
            # If there's any error, we catch it and inform the user, then continue
            print(f"No argument Passed")

            # If you want the script to end after one successful addition, uncomment the following line
    print("Completed Processing")
    return

if __name__ == "__main__":
    main_function()