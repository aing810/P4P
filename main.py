import tkinter as tk
from tkinter import ttk

def on_slider_change(metric_changed):
    # If the total exceeds 1, reduce the most recently adjusted slider
    total = sum(slider.get() for slider in sliders.values())
    if total > 1:
        excess_value = total - 1
        new_value = sliders[metric_changed].get() - excess_value
        sliders[metric_changed].set(new_value)

    # Update the displayed values for the sliders
    for metric, slider in sliders.items():
        slider_labels[metric].config(text=f"{metric}: {slider.get():.2f}")

    # Update the total label
    total = sum(slider.get() for slider in sliders.values())
    total_label.config(text=f"Total: {total:.2f}")
    
    # Check if the rounded total is exactly 1
    if round(total, 2) == 1:
        calc_button.config(state=tk.NORMAL)
    else:
        calc_button.config(state=tk.DISABLED)

def calculate_ranking():
    # TODO: Implement the ranking calculation based on the sliders' values
    wind_weight = sliders['Wind speed'].get()
    pressure_weight = sliders['Atmospheric pressure'].get()
    altitude_weight = sliders['Altitude'].get()
    density_weight = sliders['Population density'].get()
    woodburner_weight = sliders['Wood burner density'].get()
    result_var.set("Calculated rankings will appear here.")

    # For demonstration, let's just print them
    print(f"Wind Weight: {wind_weight}")
    print(f"Pressure Weight: {pressure_weight}")
    print(f"Altitude Weight: {altitude_weight}")
    print(f"Population Density Weight: {density_weight}")
    print(f"Woodburner Density Weight: {woodburner_weight}")

    results = {'Invercargill': {'Cromwell': {'wind_score': 0.009801594005568952, 'pressure_score': 0.010659595511681216, 'density_score': 0.017142629387204376, 'altitude_score': 0.9523809523809523, 'woodburner_score': 0.02820745372643021, 'total_score': 1.0181922250118371}, 'Masterton': {'wind_score': 0.07539834478481838, 'pressure_score': 0.013869741536417063, 'density_score': 0.2323579700450593, 'altitude_score': 0.1984126984126984, 'woodburner_score': 0.2020504667637993, 'total_score': 0.7220892215427924}, 'Reefton': {'wind_score': 0.02933791202874373, 'pressure_score': 0.015119790699094873, 'density_score': 0.13066528570567998, 'altitude_score': 0.42063492063492064, 'woodburner_score': 0.3436260160331387, 'total_score': 0.939383925101578}}, 'Cromwell': {'Invercargill': {'wind_score': 0.009801594005568952, 'pressure_score': 0.010659595511681216, 'density_score': 0.017142629387204376, 'altitude_score': 0.9523809523809523, 'woodburner_score': 0.02820745372643021, 'total_score': 1.0181922250118371}, 'Masterton': {'wind_score': 0.07522248936866244, 'pressure_score': 0.024186632790616443, 'density_score': 0.30134574273742615, 'altitude_score': 0.7063492063492064, 'woodburner_score': 0.5869215065186846, 'total_score': 1.694025577764596}, 'Reefton': {'wind_score': 0.03031406412288818, 'pressure_score': 0.011613772582161331, 'density_score': 0.4030384270768054, 'altitude_score': 0.48412698412698413, 'woodburner_score': 0.041245023721746536, 'total_score': 0.9703382716305855}}, 'Masterton': {'Invercargill': {'wind_score': 0.07539834478481838, 'pressure_score': 0.013869741536417063, 'density_score': 0.2323579700450593, 'altitude_score': 0.1984126984126984, 'woodburner_score': 0.2020504667637993, 'total_score': 0.7220892215427924}, 'Cromwell': {'wind_score': 0.07522248936866244, 'pressure_score': 0.024186632790616443, 'density_score': 0.30134574273742615, 'altitude_score': 0.7063492063492064, 'woodburner_score': 0.5869215065186846, 'total_score': 1.694025577764596}, 'Reefton': {'wind_score': 0.08953179980960459, 'pressure_score': 0.027157916149414593, 'density_score': 0.4491536578303103, 'altitude_score': 0.1746031746031746, 'woodburner_score': 0.13259798931562256, 'total_score': 0.8730445377081266}}, 'Reefton': {'Invercargill': {'wind_score': 0.02933791202874373, 'pressure_score': 0.015119790699094873, 'density_score': 0.13066528570567998, 'altitude_score': 0.42063492063492064, 'woodburner_score': 0.3436260160331387, 'total_score': 0.939383925101578}, 'Cromwell': {'wind_score': 0.03031406412288818, 'pressure_score': 0.011613772582161331, 'density_score': 0.4030384270768054, 'altitude_score': 0.48412698412698413, 'woodburner_score': 0.041245023721746536, 'total_score': 0.9703382716305855}, 'Masterton': {'wind_score': 0.08953179980960459, 'pressure_score': 0.027157916149414593, 'density_score': 0.4491536578303103, 'altitude_score': 0.1746031746031746, 'woodburner_score': 0.13259798931562256, 'total_score': 0.8730445377081266}}}


        # Applying the weightings to the scores
    ordered_results = {}
    for target_town, child_dicts in results.items():
        ordered_results[target_town] = {}
        for child_name, scores in child_dicts.items():
            # Calculate weighted scores
            scores['total_score'] = (
                scores['wind_score'] * wind_weight +
                scores['pressure_score'] * pressure_weight +
                scores['density_score'] * density_weight +
                scores['altitude_score'] * altitude_weight +
                scores['woodburner_score'] * woodburner_weight
            )
            ordered_results[target_town][child_name] = scores['total_score']
            # print(target_town, child_name, scores['total_score'])

        # Sorting the child dictionaries with proper handling of missing 'weighted_score' key
    sorted_results = {}
    for target_town, child_dicts in results.items():
        # Sort child dictionaries based on weighted score, handling cases where the key might be missing
        sorted_child_dicts = sorted(
            child_dicts.items(), key=lambda x: x[1].get('total_score', 0))
        # Storing the sorted child dictionary names in the new dictionary
        sorted_results[target_town] = [
            child_name for child_name, _ in sorted_child_dicts]
        # print(sorted_results)

        sorted_results_with_scores = {}
    for target_town, scores in ordered_results.items():
        sorted_scores = sorted(scores.items(), key=lambda x: x[1])
        sorted_results_with_scores[target_town] = sorted_scores

    final_sorted_results = {}
    for target_town, rankings in sorted_results_with_scores.items():
        final_sorted_results[target_town] = [(child_town, score) for child_town, score in rankings]


    # Counting the number of correct rankings for each index in the lists
    correct_rankings = 0
    total_rankings = 0

    # Ground truth data
    ground_truth = {
        'Invercargill': ['Cromwell', 'Reefton', 'Masterton'],
        'Cromwell': ['Invercargill', 'Reefton', 'Masterton'],
        'Masterton': ['Invercargill', 'Cromwell', 'Reefton'],
        'Reefton': ['Invercargill', 'Cromwell', 'Masterton']
    }


    for target_town, sorted_order in final_sorted_results.items():
        towns = [item[0] for item in sorted_order]
        for idx, town in enumerate(towns):
            if town == ground_truth[target_town][idx]:
                correct_rankings += 1
            total_rankings += 1

    # Calculating accuracy
    accuracy_percentage = (correct_rankings / total_rankings) * 100

    
    print(sorted_results)
    outputString = f"The accuracy of these weightings is {round(accuracy_percentage,2)} %"
    result_var.set(outputString)
    print(accuracy_percentage)
def reset_to_defaults():
    default_weights = {
        'Wind speed': 0.3125,
        'Atmospheric pressure': 0.21875,
        'Altitude': 0.03125,
        'Population density': 0.3125,
        'Wood burner density': 0.125
    }
    for metric, weight in default_weights.items():
        sliders[metric].set(weight)
        slider_labels[metric].config(text=f"{metric}: {weight:.2f}")
    on_slider_change(None)

root = tk.Tk()
root.title("Rank Towns")

frame = ttk.LabelFrame(root, text="Adjust Weights", padding=(10, 5))
frame.pack(pady=20, padx=20, fill=tk.BOTH, expand=True)

# Define total label before creating sliders
total_label = ttk.Label(frame, text="Total: 1.00", font=('Arial', 10))
total_label.pack(pady=10)

metrics = [
    'Wind speed',
    'Atmospheric pressure',
    'Altitude',
    'Population density',
    'Wood burner density'
]
sliders = {}
slider_labels = {}
for metric in metrics:
    row_frame = ttk.Frame(frame)
    row_frame.pack(fill=tk.X, pady=2)
    
    label = ttk.Label(row_frame, text=metric, width=20)
    label.grid(row=0, column=0)
    
    slider = ttk.Scale(row_frame, from_=0, to_=1, orient=tk.HORIZONTAL, length=200, 
                       command=lambda v, metric=metric: on_slider_change(metric))
    default_weights = {
        'Wind speed': 0.3125,
        'Atmospheric pressure': 0.21875,
        'Altitude': 0.03125,
        'Population density': 0.3125,
        'Wood burner density': 0.125
    }
    slider.set(default_weights[metric])  
    slider.grid(row=0, column=1)
    
    value_label = ttk.Label(row_frame, text=f"{slider.get():.2f}")
    value_label.grid(row=0, column=2)
    
    sliders[metric] = slider
    slider_labels[metric] = value_label

calc_button = ttk.Button(root, text="Calculate Ranking", command=calculate_ranking, state=tk.DISABLED)
calc_button.pack(pady=10)

reset_button = ttk.Button(root, text="Reset to Defaults", command=reset_to_defaults)
reset_button.pack(pady=10)

result_var = tk.StringVar()
result_label = ttk.Label(root, textvariable=result_var, wraplength=300)
result_label.pack(pady=20)

root.mainloop()
