import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';

// iPhone 11 Pro width baseline
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const WeatherApp = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('Tehran');
  const [input, setInput] = useState('Tehran');

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=53a0ca1fcde43102647e4478d09ff07c&units=metric`
      );
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setWeather(data);
      setCity(cityName);
    } catch (err) {
      setError('Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  // Custom 3D sun icon (fallback)
  const sun3dIcon = 'https://cdn3.vectorstock.com/i/1000x1000/62/31/3d-sun-weather-icon-vector-47106231.jpg';
  const icon =
    weather && weather.weather && weather.weather[0]?.main === 'Clear'
      ? sun3dIcon
      : weather && weather.weather && weather.weather[0]?.icon
        ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
        : sun3dIcon;

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter city name..."
          placeholderTextColor="#ccc"
          autoCapitalize="words"
          returnKeyType="search"
          onSubmitEditing={() => fetchWeather(input)}
        />
        <TouchableOpacity style={styles.button} onPress={() => fetchWeather(input)}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.city}>Fetching weather data...</Text>
        </>
      ) : error || !weather ? (
        <Text style={styles.city}>{error || 'Unable to retrieve data'}</Text>
      ) : (
        <>
          <Text style={styles.city}>{weather.name}</Text>
          <Image
            source={{ uri: (() => {
              const main = weather.weather[0].main;
              if (main === 'Clear') return 'https://cdn-icons-png.flaticon.com/512/831/831682.png';
              if (main === 'Clouds') return 'https://cdn-icons-png.flaticon.com/512/414/414825.png';
              if (main === 'Rain') return 'https://cdn-icons-png.flaticon.com/512/1163/1163624.png';
              if (main === 'Snow') return 'https://cdn-icons-png.flaticon.com/512/642/642102.png';
              if (main === 'Thunderstorm') return 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png';
              if (main === 'Drizzle') return 'https://cdn-icons-png.flaticon.com/512/414/414974.png';
              if (main === 'Mist' || main === 'Fog' || main === 'Haze') return 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png';
              return `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;
            })() }}
            style={styles.weatherIcon}
            resizeMode="contain"
          />
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <View style={styles.detailsRow}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Precipitation</Text>
              <Text style={styles.detailValue}>
                {weather.rain && weather.rain["1h"] ? `${weather.rain["1h"]} mm` : '0 mm'}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6a85b6',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(24),
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: normalize(16),
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: normalize(18),
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    minWidth: normalize(120),
  },
  button: {
    backgroundColor: '#ffd700',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(6),
    marginLeft: normalize(8),
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: normalize(16),
  },
  city: {
    color: '#fff',
    fontSize: normalize(32),
    fontWeight: '600',
    marginBottom: normalize(10),
  },
  temp: {
    color: '#fff',
    fontSize: normalize(60),
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(10),
    gap: normalize(18),
  },
  detailBox: {
    alignItems: 'center',
    marginHorizontal: normalize(8),
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: normalize(12),
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    minWidth: normalize(80),
  },
  detailLabel: {
    color: '#fff',
    fontSize: normalize(14),
    marginBottom: normalize(2),
  },
  detailValue: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: normalize(18),
  },
  weatherIcon: {
    width: normalize(60),
    height: normalize(60),
    marginBottom: normalize(4),
  },
});

export default WeatherApp;
