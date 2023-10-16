# caller_script.py
import subprocess
import argparse

def call_main_script_with_town(town_name):
    # The script you want to call

    # Create the parser
    parser = argparse.ArgumentParser(description='Process some town data.')

    # Declare an argument (--town), type of the argument (str), and a help description.
    parser.add_argument('--town', type=str, help='The name of the town to process')

    # Parse the arguments
    args = parser.parse_args()

    # Check if the town was provided
    if args.town:
        script_path = 'Scripts/runAlgo.py'

        # The argument you want to pass
        argument = '--town'

        # Using subprocess to call the script with the argument
        subprocess.run(['python', script_path, argument, town_name])
    else:
        raise Exception("Town Not found")


# This function could be called with different town names as needed
if __name__ == '__main__':
    call_main_script_with_town('Wellington')