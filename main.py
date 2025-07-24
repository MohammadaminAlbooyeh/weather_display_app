import requests
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.properties import ObjectProperty

# To prevent the window from being resized on some platforms
from kivy.config import Config
Config.set('graphics', 'width', '400')
Config.set('graphics', 'height', '300')


class WeatherLayout(BoxLayout):
    city_input = ObjectProperty(None)
    weather_info_label = ObjectProperty(None)

    def search_weather(self):
        api_key = "53a0ca1fcde43102647e4478d09ff07c"  # <-- Paste your API key here
        city_name = self.city_input.text.strip()

        if not city_name:
            self.weather_info_label.text = "Please enter a city name."
            return

        # Show a "searching" message
        self.weather_info_label.text = f"Searching for {city_name}..."

        # Build the API request URL
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&units=metric"

        # Make the request to the server
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            weather_data = response.json()

            if weather_data.get("cod") != 200:
                self.weather_info_label.text = f"Error: {weather_data.get('message', 'City not found')}"
            else:
                temp = weather_data['main']['temp']
                description = weather_data['weather'][0]['description']
                self.weather_info_label.text = (f"City: {city_name.title()}\n"
                                               f"Temperature: {temp}°C\n"
                                               f"Description: {description.capitalize()}")
        except requests.exceptions.HTTPError:
            self.weather_info_label.text = "City not found or API error."
        except requests.exceptions.RequestException:
            self.weather_info_label.text = "Failed to connect to the server."


class WeatherApp(App):
    def build(self):
        return WeatherLayout()


if __name__ == '__main__':
    WeatherApp().run()