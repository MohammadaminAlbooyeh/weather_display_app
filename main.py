import requests
from kivy.app import App
import configparser
from kivy.uix.boxlayout import BoxLayout
from kivy.properties import ObjectProperty

# To prevent the window from being resized on some platforms
from kivy.config import Config
Config.set('graphics', 'width', '400')
Config.set('graphics', 'height', '300')


class WeatherLayout(BoxLayout):
    city_input = ObjectProperty(None)
    weather_info_label = ObjectProperty(None)
    weather_icon = ObjectProperty(None)

    def search_weather(self):
        config = configparser.ConfigParser()
        config.read('config.ini')
        api_key = config['openweathermap']['api_key']

        city_name = self.city_input.text.strip()

        if not city_name:
            self.weather_info_label.text = "Please enter a city name."
            self.weather_icon.source = ''
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
                icon_code = weather_data['weather'][0]['icon']

                # Update the weather icon
                self.weather_icon.source = f"http://openweathermap.org/img/wn/{icon_code}@2x.png"

                # Update the weather information label
                self.weather_info_label.text = (f"City: {city_name.title()}\n"
                                               f"Temperature: {temp}°C\n"
                                               f"Description: {description.capitalize()}")
        except requests.exceptions.HTTPError:
            self.weather_info_label.text = "City not found or API error."
            self.weather_icon.source = ''
        except requests.exceptions.RequestException:
            self.weather_info_label.text = "Failed to connect to the server."
            self.weather_icon.source = ''


class WeatherApp(App):
    def build(self):
        return WeatherLayout()


if __name__ == '__main__':
    WeatherApp().run()