
import tkinter as tk
from tkinter import ttk

def on_slider_change(metric_changed):
    total = sum(slider.get() for slider in sliders.values())
    if total > 1:
        excess_value = total - 1
        new_value = sliders[metric_changed].get() - excess_value
        sliders[metric_changed].set(new_value)

    for metric, slider in sliders.items():
        slider_labels[metric].config(text=f"{metric}: {slider.get():.2f}")

    total = sum(slider.get() for slider in sliders.values())
    total_label.config(text=f"Total: {total:.2f}")
    
    if round(total, 2) == 1:
        calc_button.config(state=tk.NORMAL)
    else:
        calc_button.config(state=tk.DISABLED)

def display_results_window(accuracy, sorted_results):
    result_window = tk.Toplevel(root)
    result_window.title("Results and Accuracy")

    # Get screen width and height
    screen_width = result_window.winfo_screenwidth()
    screen_height = result_window.winfo_screenheight()

    # Calculate position x and y coordinates
    x = (screen_width / 2) - (600 / 2)  # Assuming a width of 600 for the window
    y = (screen_height / 2) - (400 / 2)  # Assuming a height of 400 for the window
    result_window.geometry(f'400x300+{int(x)}+{int(y)}')

    tk.Label(result_window, text=f"Accuracy: {accuracy} %").pack(pady=10)
    tk.Label(result_window, text="Rankings:").pack(pady=10)

    # Create a frame for each column
    left_frame = ttk.Frame(result_window)
    right_frame = ttk.Frame(result_window)
    
    left_frame.pack(side=tk.LEFT, padx=10, pady=10, expand=True, fill=tk.BOTH)
    right_frame.pack(side=tk.RIGHT, padx=10, pady=10, expand=True, fill=tk.BOTH)
    
    # Split towns between two frames
    towns = list(sorted_results.keys())
    left_towns = towns[:len(towns)//2]
    right_towns = towns[len(towns)//2:]
    
    ground_truth = {
        'Invercargill': ['Cromwell', 'Reefton', 'Masterton'],
        'Cromwell': ['Invercargill', 'Reefton', 'Masterton'],
        'Masterton': ['Invercargill', 'Cromwell', 'Reefton'],
        'Reefton': ['Invercargill', 'Cromwell', 'Masterton']
    }

    for target_town in left_towns:
        tk.Label(left_frame, text=f"Target Town: {target_town}", anchor='e').pack(pady=5, fill=tk.X)
        for idx, town in enumerate(sorted_results[target_town], 1):
            correct = town == ground_truth[target_town][idx - 1]
            font_weight = 'bold' if correct else 'normal'
            color = 'green' if correct else 'black'
            tk.Label(left_frame, text=f"   Rank {idx}: {town}", anchor='e', font=('Arial', 10, font_weight), fg=color).pack(fill=tk.X, padx=20)
    
    for target_town in right_towns:
        tk.Label(right_frame, text=f"Target Town: {target_town}", anchor='w').pack(pady=5, fill=tk.X)
        for idx, town in enumerate(sorted_results[target_town], 1):
            correct = town == ground_truth[target_town][idx - 1]
            font_weight = 'bold' if correct else 'normal'
            color = 'green' if correct else 'black'
            tk.Label(right_frame, text=f"   Rank {idx}: {town}", anchor='w', font=('Arial', 10, font_weight), fg=color).pack(fill=tk.X, padx=20)

def calculate_ranking():
    wind_weight = sliders['Wind speed'].get()
    pressure_weight = sliders['Atmospheric pressure'].get()
    altitude_weight = sliders['Altitude'].get()
    density_weight = sliders['Population density'].get()
    woodburner_weight = sliders['Wood burner density'].get()

    results = {'Invercargill': {'Cromwell': {'wind_score': 0.009801594005568952, 'pressure_score': 0.010659595511681216, 'density_score': 0.017142629387204376, 'altitude_score': 0.9523809523809523, 'woodburner_score': 0.02820745372643021, 'total_score': 1.0181922250118371}, 'Masterton': {'wind_score': 0.07539834478481838, 'pressure_score': 0.013869741536417063, 'density_score': 0.2323579700450593, 'altitude_score': 0.1984126984126984, 'woodburner_score': 0.2020504667637993, 'total_score': 0.7220892215427924}, 'Reefton': {'wind_score': 0.02933791202874373, 'pressure_score': 0.015119790699094873, 'density_score': 0.13066528570567998, 'altitude_score': 0.42063492063492064, 'woodburner_score': 0.3436260160331387, 'total_score': 0.939383925101578}}, 'Cromwell': {'Invercargill': {'wind_score': 0.009801594005568952, 'pressure_score': 0.010659595511681216, 'density_score': 0.017142629387204376, 'altitude_score': 0.9523809523809523, 'woodburner_score': 0.02820745372643021, 'total_score': 1.0181922250118371}, 'Masterton': {'wind_score': 0.07522248936866244, 'pressure_score': 0.024186632790616443, 'density_score': 0.30134574273742615, 'altitude_score': 0.7063492063492064, 'woodburner_score': 0.5869215065186846, 'total_score': 1.694025577764596}, 'Reefton': {'wind_score': 0.03031406412288818, 'pressure_score': 0.011613772582161331, 'density_score': 0.4030384270768054, 'altitude_score': 0.48412698412698413, 'woodburner_score': 0.041245023721746536, 'total_score': 0.9703382716305855}}, 'Masterton': {'Invercargill': {'wind_score': 0.07539834478481838, 'pressure_score': 0.013869741536417063, 'density_score': 0.2323579700450593, 'altitude_score': 0.1984126984126984, 'woodburner_score': 0.2020504667637993, 'total_score': 0.7220892215427924}, 'Cromwell': {'wind_score': 0.07522248936866244, 'pressure_score': 0.024186632790616443, 'density_score': 0.30134574273742615, 'altitude_score': 0.7063492063492064, 'woodburner_score': 0.5869215065186846, 'total_score': 1.694025577764596}, 'Reefton': {'wind_score': 0.08953179980960459, 'pressure_score': 0.027157916149414593, 'density_score': 0.4491536578303103, 'altitude_score': 0.1746031746031746, 'woodburner_score': 0.13259798931562256, 'total_score': 0.8730445377081266}}, 'Reefton': {'Invercargill': {'wind_score': 0.02933791202874373, 'pressure_score': 0.015119790699094873, 'density_score': 0.13066528570567998, 'altitude_score': 0.42063492063492064, 'woodburner_score': 0.3436260160331387, 'total_score': 0.939383925101578}, 'Cromwell': {'wind_score': 0.03031406412288818, 'pressure_score': 0.011613772582161331, 'density_score': 0.4030384270768054, 'altitude_score': 0.48412698412698413, 'woodburner_score': 0.041245023721746536, 'total_score': 0.9703382716305855}, 'Masterton': {'wind_score': 0.08953179980960459, 'pressure_score': 0.027157916149414593, 'density_score': 0.4491536578303103, 'altitude_score': 0.1746031746031746, 'woodburner_score': 0.13259798931562256, 'total_score': 0.8730445377081266}}}


    ordered_results = {}
    for target_town, child_dicts in results.items():
        ordered_results[target_town] = {}
        for child_name, scores in child_dicts.items():
            scores['total_score'] = (
                scores['wind_score'] * wind_weight +
                scores['pressure_score'] * pressure_weight +
                scores['density_score'] * density_weight +
                scores['altitude_score'] * altitude_weight +
                scores['woodburner_score'] * woodburner_weight
            )
            ordered_results[target_town][child_name] = scores['total_score']

    sorted_results = {}
    for target_town, child_dicts in results.items():
        sorted_child_dicts = sorted(
            child_dicts.items(), key=lambda x: x[1].get('total_score', 0))
        sorted_results[target_town] = [
            child_name for child_name, _ in sorted_child_dicts]

    correct_rankings = 0
    total_rankings = 0
    ground_truth = {
        'Invercargill': ['Cromwell', 'Reefton', 'Masterton'],
        'Cromwell': ['Invercargill', 'Reefton', 'Masterton'],
        'Masterton': ['Invercargill', 'Cromwell', 'Reefton'],
        'Reefton': ['Invercargill', 'Cromwell', 'Masterton']
    }

    for target_town, sorted_order in sorted_results.items():
        for idx, town in enumerate(sorted_order):
            if town == ground_truth[target_town][idx]:
                correct_rankings += 1
            total_rankings += 1

    accuracy_percentage = (correct_rankings / total_rankings) * 100

    display_results_window(round(accuracy_percentage, 2), sorted_results)

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

frame = tk.LabelFrame(root, text="Adjust Weights", font=('Arial', 12, 'bold'), pady=20, padx=20)
frame.pack(pady=20, padx=20, fill=tk.BOTH, expand=True)

total_label = tk.Label(frame, text="Total: 1.00", font=('Arial', 10))
total_label.pack(pady=15)

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
