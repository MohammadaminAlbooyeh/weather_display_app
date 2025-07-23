# main.py

from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.core.window import Window
import requests # Import the requests library for API calls
import json     # Import json for handling API responses

# Set window background color (optional)
Window.clearcolor = (0.2, 0.2, 0.2, 1) # Dark gray

# --- OpenWeatherMap API Configuration ---
# IMPORTANT: Replace 'YOUR_API_KEY' with your actual API key from OpenWeatherMap
API_KEY = "53a0ca1fcde43102647e4478d09ff07c"
BASE_URL = "http://api.openweathermap.org/data/2.5/weather?"
# --- End API Configuration ---

class WeatherApp(App):
    def build(self):
        # Create a vertical layout to arrange elements
        layout = BoxLayout(orientation='vertical', padding=20, spacing=10)

        # Title label
        self.title_label = Label(
            text="Weather Display",
            font_size='30sp',
            color=(1, 1, 1, 1) # White
        )
        layout.add_widget(self.title_label)

        # Input for city name
        self.city_input = TextInput(
            hint_text="Enter city name",
            multiline=False,
            size_hint_y=None,
            height='48dp',
            font_size='20sp',
            background_color=(0.3, 0.3, 0.3, 1), # Darker gray
            foreground_color=(1, 1, 1, 1), # White
            padding=(10, 10, 10, 10) # Internal padding
        )
        layout.add_widget(self.city_input)

        # Button to get weather information
        self.get_weather_button = Button(
            text="Get Weather",
            size_hint_y=None,
            height='48dp',
            font_size='22sp',
            background_normal='', # Remove default background
            background_color=(0.1, 0.5, 0.8, 1), # Blue
            color=(1, 1, 1, 1), # White text
            on_press=self.get_weather_info # Function to be called on press
        )
        layout.add_widget(self.get_weather_button)

        # Label to display weather result
        self.weather_result_label = Label(
            text="Weather information will be displayed here.",
            font_size='20sp',
            color=(0.8, 0.8, 0.8, 1), # Light gray
            text_size=(Window.width - 40, None), # Adjust text size based on window width
            halign='center', # Horizontal alignment
            valign='middle' # Vertical alignment
        )
        layout.add_widget(self.weather_result_label)

        return layout

    def get_weather_info(self, instance):
        city = self.city_input.text.strip() # Get city name and remove leading/trailing spaces
        if not city:
            self.weather_result_label.text = "Please enter a city name."
            return

        self.weather_result_label.text = f"Fetching weather for: {city}..."

        try:
            # Construct the complete API URL
            complete_url = f"{BASE_URL}q={city}&appid={API_KEY}&units=metric" # units=metric for Celsius

            # Make the API request
            response = requests.get(complete_url)
            data = response.json() # Parse the JSON response

            # Check if the city was found
            if data["cod"] == 200: # 'cod' 200 means success
                main_data = data["main"]
                weather_data = data["weather"][0] # Get the first weather description

                temperature = main_data["temp"]
                pressure = main_data["pressure"]
                humidity = main_data["humidity"]
                description = weather_data["description"].capitalize() # Capitalize first letter

                # Update the result label with fetched data
                self.weather_result_label.text = (
                    f"Weather in {city}:\n"
                    f"Temperature: {temperature}°C\n"
                    f"Description: {description}\n"
                    f"Humidity: {humidity}%\n"
                    f"Pressure: {pressure} hPa"
                )
            else:
                # Handle cases where city is not found or other API errors
                self.weather_result_label.text = f"City not found or API error: {data.get('message', 'Unknown error')}"

        except requests.exceptions.ConnectionError:
            self.weather_result_label.text = "Network error. Please check your internet connection."
        except json.JSONDecodeError:
            self.weather_result_label.text = "Error decoding API response. Invalid data received."
        except Exception as e:
            self.weather_result_label.text = f"An unexpected error occurred: {e}"

if __name__ == '__main__':
    WeatherApp().run()
