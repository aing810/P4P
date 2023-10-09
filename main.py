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
    result_var.set("Calculated rankings will appear here.")

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
