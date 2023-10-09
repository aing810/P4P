import tkinter as tk
from tkinter import ttk

def on_slider_change(value):
    # Update the displayed values for the sliders
    for metric, slider in sliders.items():
        slider_labels[metric].config(text=f"{metric}: {slider.get():.2f}")
    update_total_label()

def update_total_label():
    # Update the total label
    total = sum(slider.get() for slider in sliders.values())
    total_label.config(text=f"Total: {total:.2f}")
    
    # Check if the total is approximately 1
    if 0.99 <= total <= 1.01:
        total_label.config(fg='green')
        calc_button.config(state=tk.NORMAL)
    else:
        total_label.config(fg='red')
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
    update_total_label()

root = tk.Tk()
root.title("Rank Towns")

frame = ttk.LabelFrame(root, text="Adjust Weights", padding=(10, 5))
frame.pack(pady=20, padx=20, fill=tk.BOTH, expand=True)

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
    
    slider = ttk.Scale(row_frame, from_=0, to_=1, orient=tk.HORIZONTAL, length=200, command=on_slider_change)
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

total_label = ttk.Label(frame, text="Total: 1.00", font=('Arial', 10, 'bold'))
total_label.pack(pady=10)

calc_button = ttk.Button(root, text="Calculate Ranking", command=calculate_ranking, state=tk.NORMAL)
calc_button.pack(pady=10)

reset_button = ttk.Button(root, text="Reset to Defaults", command=reset_to_defaults)
reset_button.pack(pady=10)

result_var = tk.StringVar()
result_label = ttk.Label(root, textvariable=result_var, wraplength=300)
result_label.pack(pady=20)

root.mainloop()
