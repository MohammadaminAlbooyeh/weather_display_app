

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image as RNImage, ScrollView, Dimensions, PixelRatio } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://192.168.1.110:5001/weather')
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => setError('Error: ' + err));
  }, []);

  const details = [
    { icon: 'https://cdn-icons-png.flaticon.com/512/414/414974.png', label: 'Rain', value: '22%' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/201/201818.png', label: 'Wind', value: '12 km/h' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/728/728093.png', label: 'Humidity', value: '18%' },
  ];

  const hourly = [
    { time: '7 am', icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png', temp: 25 },
    { time: '8 am', icon: 'https://cdn-icons-png.flaticon.com/512/869/869869.png', temp: 26 },
    { time: '9 am', icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png', temp: 27 },
    { time: '10 am', icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png', temp: 28 },
  ];

  return (
    <LinearGradient colors={["#6a85b6", "#bac8e0"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? (
          <ThemedText style={styles.error}>{error}</ThemedText>
        ) : weather ? (
          <>
            <ThemedText style={styles.conditionMain}>{weather.condition}</ThemedText>
            {/* Only show temperature, no extra container */}
            <ThemedText style={[styles.tempBig, { alignSelf: 'center', marginBottom: 8 }]}>{weather.temperature}°</ThemedText>
            <ThemedText style={styles.date}>Mon June 17 | 10:00 AM</ThemedText>
            <ThemedText style={styles.hilo}>H:27  L:18</ThemedText>
            <View style={styles.detailsRow}>
              {details.map((d, i) => (
                <View key={i} style={styles.detailBox}>
                  <RNImage source={{ uri: d.icon }} style={styles.detailIcon} />
                  <ThemedText style={styles.detailValue}>{d.value}</ThemedText>
                  <ThemedText style={styles.detailLabel}>{d.label}</ThemedText>
                </View>
              ))}
            </View>
            <View style={styles.hourlyRow}>
              <ThemedText style={styles.today}>Today</ThemedText>
              <ThemedText style={styles.next7}>Next 7 Day &gt;</ThemedText>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
              {hourly.map((h, i) => (
                <View key={i} style={styles.hourBox}>
                  <ThemedText style={styles.hourTime}>{h.time}</ThemedText>
                  <RNImage source={{ uri: h.icon }} style={styles.hourIcon} />
                  <ThemedText style={styles.hourTemp}>{h.temp}°</ThemedText>
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          <ThemedText style={styles.loading}>Loading weather...</ThemedText>
        )}
      </ScrollView>
    </LinearGradient>
  );
}


// Responsive scaling helpers
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // iPhone 11 Pro width baseline
function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: normalize(40),
    minHeight: '100%',
  },
  conditionMain: {
    color: '#fff',
    fontSize: normalize(22),
    fontWeight: '600',
    marginBottom: normalize(8),
    marginTop: normalize(10),
  },
  weatherIconBig: {
    width: normalize(110),
    height: normalize(110),
    marginBottom: normalize(-10),
    marginTop: normalize(10),
  },
  date: {
    color: '#fff',
    fontSize: normalize(16),
    marginBottom: normalize(8),
  },
  tempBig: {
    color: '#fff',
    fontSize: normalize(90),
    fontWeight: 'bold',
    marginBottom: normalize(20),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: normalize(12),
    borderRadius: normalize(10),
  },
  hilo: {
    color: '#fff',
    fontSize: normalize(16),
    marginBottom: normalize(18),
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: normalize(340),
    marginBottom: normalize(18),
    backgroundColor: 'rgba(40,30,80,0.18)',
    borderRadius: normalize(22),
    paddingVertical: normalize(8),
    alignSelf: 'center',
  },
  detailBox: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: normalize(18),
    paddingVertical: normalize(10),
    paddingHorizontal: 0,
    width: normalize(100),
    height: normalize(90),
    justifyContent: 'center',
  },
  detailIcon: {
    width: normalize(44),
    height: normalize(44),
    marginBottom: normalize(6),
  },
  detailValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalize(20),
    marginBottom: normalize(2),
  },
  detailLabel: {
    color: '#fff',
    fontSize: normalize(15),
  },
  hourlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: normalize(340),
    marginBottom: normalize(8),
    marginTop: normalize(10),
    alignSelf: 'center',
  },
  today: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: normalize(18),
  },
  next7: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: normalize(18),
  },
  hourlyScroll: {
    width: normalize(340),
    marginBottom: normalize(10),
    alignSelf: 'center',
  },
  hourBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: normalize(18),
    paddingVertical: normalize(12),
    paddingHorizontal: 0,
    marginRight: normalize(14),
    width: normalize(70),
    height: normalize(90),
    justifyContent: 'center',
  },
  hourTime: {
    color: '#fff',
    fontSize: normalize(15),
    marginBottom: normalize(4),
  },
  hourIcon: {
    width: normalize(36),
    height: normalize(36),
    marginBottom: normalize(4),
  },
  hourTemp: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalize(18),
  },
  loading: {
    color: '#fff',
    fontSize: normalize(20),
    marginTop: normalize(40),
  },
  error: {
    color: 'red',
    fontSize: normalize(20),
    marginTop: normalize(40),
  },
});
