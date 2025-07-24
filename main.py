import requests
from kivy.app import App
import configparser
import threading
from kivy.uix.floatlayout import FloatLayout
from kivy.properties import ObjectProperty
from kivy.logger import Logger
from kivy.clock import mainthread

# To prevent the window from being resized on some platforms
from kivy.config import Config
Config.set('graphics', 'width', '400')
Config.set('graphics', 'height', '300')


class WeatherLayout(FloatLayout):
    
    def search_weather(self):
        city_name = self.ids.city_input.text.strip()
        if not city_name:
            self.ids.weather_info_label.text = "Please enter a city name."
            return

        # Show the loading spinner and hide the results
        self.show_loading(True)

        # Run the network request in a separate thread to avoid freezing the UI
        thread = threading.Thread(target=self._fetch_weather_data, args=(city_name,))
        thread.start()

    def _get_background_image(self, weather_condition):
        """Returns the path to a background image based on the weather."""
        condition = weather_condition.lower()
        if 'clear' in condition:
            return 'images/clear.jpg'
        elif 'clouds' in condition:
            return 'images/clouds.jpg'
        elif 'rain' in condition or 'drizzle' in condition:
            return 'images/rain.jpg'
        elif 'snow' in condition:
            return 'images/snow.jpg'
        elif 'thunderstorm' in condition:
            return 'images/thunderstorm.jpg'
        # Default background for other conditions like mist, fog, etc.
        return 'images/default.jpg'

    def show_loading(self, is_loading):
        self.ids.results_layout.opacity = 0 if is_loading else 1
        self.ids.loading_spinner.opacity = 1 if is_loading else 0
        self.ids.loading_spinner.active = is_loading

    def _fetch_weather_data(self, city_name):
        # This method runs in a background thread
        try:
            config = configparser.ConfigParser()
            config.read('config.ini')
            api_key = config['openweathermap']['api_key']

            url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&units=metric"

            response = requests.get(url, timeout=10)  # Add a timeout for safety
            response.raise_for_status()
            weather_data = response.json()

            if weather_data.get("cod") != 200:
                error_message = weather_data.get('message', 'City not found')
                self._update_ui_on_error(f"Error: {error_message.capitalize()}")
            else:
                self._update_ui_on_success(weather_data)

        except requests.exceptions.HTTPError:
            self._update_ui_on_error("City not found or API error.")
        except requests.exceptions.RequestException:
            self._update_ui_on_error("Failed to connect to the server.")
        except (configparser.Error, KeyError):
            self._update_ui_on_error("Error reading API key from config.ini.")
        except Exception as e:
            # Use Kivy's logger for better error reporting
            Logger.error(f"WeatherApp: An unexpected error occurred in fetch thread: {e}", exc_info=True)
            self._update_ui_on_error("An unexpected error occurred.")

    @mainthread
    def _update_ui_on_success(self, weather_data):
        try:
            # Safely access all data with .get() to prevent crashes from unexpected API responses
            city_name = weather_data.get('name', 'Unknown City')
            main_data = weather_data.get('main', {})
            temp = main_data.get('temp', 'N/A')
            humidity = main_data.get('humidity', 'N/A')

            weather_list = weather_data.get('weather', [])
            weather_main_condition = ''
            if weather_list:
                description = weather_list[0].get('description', 'No description')
                icon_code = weather_list[0].get('icon', '')
                # Get the main weather condition (e.g., 'Clouds', 'Clear', 'Rain')
                weather_main_condition = weather_list[0].get('main', '')
            else:
                description = 'No description'
                icon_code = ''

            # Set the background image based on the weather condition
            self.ids.background_image.source = self._get_background_image(weather_main_condition)

            if icon_code:
                self.ids.weather_icon.source = f"http://openweathermap.org/img/wn/{icon_code}@2x.png"
            else:
                self.ids.weather_icon.source = ''

            self.ids.weather_info_label.text = (f"City: {city_name}\n"
                                           f"Temperature: {temp}°C\n"
                                           f"Humidity: {humidity}%\n"
                                           f"Description: {description.capitalize()}")
        except Exception as e:
            Logger.error(f"WeatherApp: Error processing successful API response: {e}", exc_info=True)
            self._update_ui_on_error("Failed to parse weather data.")
        finally:
            # Ensure the loading spinner is always hidden after processing
            self.show_loading(False)

    @mainthread
    def _update_ui_on_error(self, message):
        self.ids.weather_info_label.text = message
        self.ids.weather_icon.source = ''
        self.ids.background_image.source = 'images/default.jpg'
        self.show_loading(False)


class WeatherApp(App):
    def build(self):
        return WeatherLayout()


if __name__ == '__main__':
    WeatherApp().run()