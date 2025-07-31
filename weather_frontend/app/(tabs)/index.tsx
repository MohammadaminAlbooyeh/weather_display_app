import { StyleSheet, View, Image as RNImage, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
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
            <RNImage
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' }}
              style={styles.weatherIconBig}
            />
            <View style={{ alignItems: 'center', marginTop: 0, marginBottom: 8 }}>
              <ThemedText style={styles.tempBig}>{weather.temperature}°</ThemedText>
            </View>
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

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 40,
    minHeight: '100%',
  },
  conditionMain: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  weatherIconBig: {
    width: 90,
    height: 90,
    marginBottom: -10,
    marginTop: 10,
  },
  date: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  tempBig: {
    color: '#fff',
    fontSize: 80,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  hilo: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginBottom: 18,
  },
  detailBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
    width: 80,
  },
  detailIcon: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },
  detailValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailLabel: {
    color: '#fff',
    fontSize: 13,
  },
  hourlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
    marginBottom: 8,
    marginTop: 10,
  },
  today: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  next7: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hourlyScroll: {
    width: 320,
    marginBottom: 10,
  },
  hourBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    width: 60,
  },
  hourTime: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 2,
  },
  hourIcon: {
    width: 28,
    height: 28,
    marginBottom: 2,
  },
  hourTemp: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loading: {
    color: '#fff',
    fontSize: 18,
    marginTop: 40,
  },
  error: {
    color: 'red',
    fontSize: 18,
    marginTop: 40,
  },
});
