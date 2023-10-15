
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from scipy.stats import wasserstein_distance
from scipy.stats import ks_2samp
import numpy as np

def compare_distributions_KS(data1, data2):
    # Perform the Kolmogorov-Smirnov (KS) test between two distributions
    ks_statistic, p_value = ks_2samp(data1, data2)

    return ks_statistic, p_value

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
#Town Population Data

def calculate_isolated_rankings(town_names, town_wind, town_pressure, town_density, town_altitude, town_woodburner):
    """
    This function isolates a weighting for a feature to 1 and the rest to 0, and runs the ranking for each metadata type.
    """
    # Metadata types and their corresponding data.
    metadata_types = {
        "wind": town_wind,
        "pressure": town_pressure,
        "density": town_density,
        "altitude": town_altitude,
        "woodburner": town_woodburner
    }

    # Store the results for each metadata type.
    all_results = {}

    for metadata_type, town_data in metadata_types.items():
        # Reset weights
        wind_weight, pressure_weight, density_weight, altitude_weight, woodburner_weight = [0] * 5

        # Set the current metadata weight to 1
        if metadata_type == "wind":
            wind_weight = 1
        elif metadata_type == "pressure":
            pressure_weight = 1
        elif metadata_type == "density":
            density_weight = 1
        elif metadata_type == "altitude":
            altitude_weight = 1
        elif metadata_type == "woodburner":
            woodburner_weight = 1

        # Calculate rankings with the isolated weight
        results = {}

        for target_town in town_names:
            scores = {
                source_town: (
                    wind_weight * earthmover_distance(town_wind[source_town], town_wind[target_town]) +
                    pressure_weight * earthmover_distance(town_pressure[source_town], town_pressure[target_town]) +
                    density_weight * difference(town_density[source_town], town_density[target_town],
                                                max(town_density.values()), min(town_density.values())) +
                    altitude_weight * difference(town_altitude[source_town], town_altitude[target_town],
                                                 max(town_altitude.values()), min(town_altitude.values())) +
                    woodburner_weight * difference(town_woodburner[source_town], town_woodburner[target_town],
                                                   max(town_woodburner.values()), min(town_woodburner.values()))
                )
                for source_town in town_names if source_town != target_town
            }

            # You might want to aggregate or process these scores further depending on your requirement.
            # For example, you might want to sum them, find an average, or even find the town with the maximum/minimum score.
            # For now, we are just collecting the scores.
            results[target_town] = scores

        # Store the results for the current metadata type
        all_results[metadata_type] = results

    return all_results  # This dictionary contains the results isolated by each metadata type.

def calculate_detailed_isolated_rankings(town_names, town_features):
    """
    Calculate scores for each town compared to every other, isolating each feature.

    :param town_names: List of all town names.
    :param town_features: Dictionary containing feature data for all towns.
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
                    # Calculate the score component for this feature.
                    data = town_features[feature]
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

# Note: This function assumes the presence of the other functions and data structures used in your original script, 
# such as earthmover_distance, difference, and the data dictionaries for each town (town_features).
# It should be placed in the same script or context where these elements are available.

# Note: This function assumes the presence of the other functions and data structures used in your original script, 
# such as earthmover_distance, difference, and the data dictionaries for each town (town_features).
# It should be placed in the same script or context where these elements are available.


cromwell_pop = 7010
masterton_pop = 22400
invercargill_pop = 49800
reefton_pop = 930
wellington_pop = 111759
mangere_pop = 163572
#https://nzdotstat.stats.govt.nz/wbos/Index.aspx?

cromwell_area = 15.63 #km²
masterton_area = 22.5 #km²
invercargill_area = 62.95 #km²
reefton_area = 2.63 #km²
wellington_area = 51.46 #km²
mangere_area = 159.73 #km^2

cromwell_density = cromwell_pop/cromwell_area
masterton_density = masterton_pop/masterton_area
invercargill_density = invercargill_pop/invercargill_area
reefton_density = reefton_pop/reefton_area
wellington_density = wellington_pop/wellington_area
mangere_density = mangere_pop/mangere_area

#https://statsnz.maps.arcgis.com/apps/webappviewer/index.html?id=6f49867abe464f86ac7526552fe19787

# Population density for each town
town_density = {
    'Invercargill': invercargill_density,
    'Cromwell': cromwell_density,
    'Masterton': masterton_density,
    'Reefton': reefton_density, 
}


# Print population densities
print("Population Density of Cromwell:", cromwell_density, "people/km²")
print("Population Density of Masterton:", masterton_density, "people/km²")
print("Population Density of Invercargill:", invercargill_density, "people/km²")
print("Population Density of Reefton:", reefton_density, "people/km²")

#Town Altitude
#https://en-nz.topographic-map.com

cromwell_altitude = 396
masterton_altitude = 111
invercargill_altitude = 18
reefton_altitude = 195
wellington_altitude = 7
mangere_altitude = 13

town_altitude = {
    'Invercargill': invercargill_altitude,
    'Cromwell': cromwell_altitude,
    'Masterton': masterton_altitude,
    'Reefton': reefton_altitude,
}



#Town Population Data

cromwell_pop = 7010
masterton_pop = 22400
invercargill_pop = 49800
reefton_pop = 930
wellington_pop = 111759
mangere_pop = 163572
#https://nzdotstat.stats.govt.nz/wbos/Index.aspx?

cromwell_area = 15.63 #km²
masterton_area = 22.5 #km²
invercargill_area = 62.95 #km²
reefton_area = 2.63 #km²

cromwell_density = cromwell_pop/cromwell_area
masterton_density = masterton_pop/masterton_area
invercargill_density = invercargill_pop/invercargill_area
reefton_density = reefton_pop/reefton_area

#https://statsnz.maps.arcgis.com/apps/webappviewer/index.html?id=6f49867abe464f86ac7526552fe19787

# Population density for each town
town_density = {
    'Invercargill': invercargill_density,
    'Cromwell': cromwell_density,
    'Masterton': masterton_density,
    'Reefton': reefton_density,
}
# Print population densities

#Wood Burners
invercargill_woodburner=10503
masterton_woodburner=6648
reefton_woodburner=477
cromwell_woodburner=1350

cromwell_area = 15.63 #km²
masterton_area = 22.5 #km²
invercargill_area = 62.95 #km²
reefton_area = 2.63 #km²

invercargill_woodburner_density = invercargill_woodburner/invercargill_area
masterton_woodburner_density = masterton_woodburner/masterton_area
cromwell_woodburner_density = cromwell_woodburner/cromwell_area
reefton_woodburner_density = reefton_woodburner/reefton_area

town_woodburner = {
    'Invercargill': invercargill_woodburner_density,
    'Cromwell': cromwell_woodburner_density,
    'Masterton': masterton_woodburner_density,
    'Reefton': reefton_woodburner_density
}

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

    # Normalize pressure data using Min-Max normalization to range [0, 1]
    scaler_pressure = MinMaxScaler()
    town_pressure[town] = scaler_pressure.fit_transform(town_pressure[town].values.reshape(-1, 1)).flatten()


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

# Note: This function assumes the presence of the other functions used in your original script, 
# such as earthmover_distance and difference.
# It should be placed in the same script or context where these elements are available.
def print_neatly(detailed_results):
    for town, comparisons in detailed_results.items():
        print(f"\n{'='*40}\nResults for {town}:\n{'='*40}")
        
        # Iterating through each town's comparison results
        for compared_town, features in comparisons.items():
            print(f"\nComparing with {compared_town}:")
            
            # Iterating through each feature score
            for feature, score in features.items():
                # Formatting the feature for better readability (removing underscores and capitalizing)
                formatted_feature = feature.replace('_', ' ').title()
                print(f"  {formatted_feature}: {score:.6f}")  # Print scores with six decimal places for precision

            print("-"*40)  # Separator for readability

        print("\n")  # Blank line for separation before the next town's results
    



wind_weight = 0.3125
pressure_weight = 0.21875
density_weight = 0.3125
altitude_weight = 0.03125
woodburner_weight = 0.125

result_rankings = calculate_town_rankings(town_names, town_wind, town_pressure, town_density, town_altitude,town_woodburner,
                                              wind_weight, pressure_weight, density_weight, altitude_weight, woodburner_weight)

weightingsOutput = calculate_detailed_isolated_rankings_direct(town_names, town_wind, town_pressure, town_density, town_altitude, town_woodburner)
print("weightings output\n", weightingsOutput)

print_neatly(weightingsOutput)

for target_town, rankings in result_rankings.items():
    print(f"Ranking of source towns for target town '{target_town}':")
    for rank, (source_town, score) in enumerate(rankings, start=1):
        print(f"{rank}. {source_town} (Score: {score:.4f})")
    print("\n")


def generate_feature_rankings(detailed_results):
    # Initialize a dictionary to hold the rankings for each feature.
    feature_rankings = {}

    # Step 1: Generate feature-specific rankings.
    for feature in detailed_results[next(iter(detailed_results))]:  # Extract feature names from the first town's data.
        feature_rankings[feature] = {}

        for town, comparisons in detailed_results.items():
            # We're creating a list of (compared_town, score) pairs.
            scored_comparisons = [(compared_town, scores[feature]) for compared_town, scores in comparisons.items()]

            # Step 2: Sort the towns based on the scores in ascending order.
            sorted_comparisons = sorted(scored_comparisons, key=lambda x: x[1])  # For ascending order.

            # Extracting only the town names after sorting.
            feature_rankings[feature][town] = [compared_town for compared_town, score in sorted_comparisons]

    # Step 3: Store in separate objects.
    # Here, we're creating separate objects for each feature's rankings.
    wind_ranking = feature_rankings.get('wind_score', {})
    pressure_ranking = feature_rankings.get('pressure_score', {})
    density_ranking = feature_rankings.get('density_score', {})
    altitude_ranking = feature_rankings.get('altitude_score', {})
    woodburner_ranking = feature_rankings.get('woodburner_score', {})

    # Each of these variables (wind_ranking, pressure_ranking, etc.) is now an object that holds the rankings for a specific feature.
    # They are in the same format as your ground_truth object and ready for comparison.

    return wind_ranking, pressure_ranking, density_ranking, altitude_ranking, woodburner_ranking

# Assuming `detailed_results` contains your detailed comparison data.
wind_ranking, pressure_ranking, density_ranking, altitude_ranking, woodburner_ranking = generate_feature_rankings(weightingsOutput)

# Step 4: Now, you can compare each of these ranking objects with your ground truth.
# You need to define the logic for this comparison based on how you determine the match between the generated rankings and the ground truth.
