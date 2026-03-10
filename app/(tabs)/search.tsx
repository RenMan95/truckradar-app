import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'https://backend-production-39372.up.railway.app';
const TRUCK_TYPES = ['Tutti', 'Bilico telonato', 'Bilico frigo', 'Motrice', 'Furgone', 'Altro'];
const DIRECTIONS = ['Tutti', 'Nord', 'Sud', 'Centro', 'Ovunque'];

export default function Search() {
  const { user } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [city, setCity] = useState('');
  const [selectedTruckType, setSelectedTruckType] = useState('Tutti');
  const [selectedDirection, setSelectedDirection] = useState('Tutti');

  const handleSearch = async () => {
    setIsLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (user?.role === 'carrier') {
        if (originCity) params.append('origin_city', originCity);
        if (destinationCity) params.append('destination_city', destinationCity);
        if (selectedTruckType !== 'Tutti') params.append('truck_type', selectedTruckType);
        const response = await fetch(`${API_URL}/api/loads?${params.toString()}`);
        if (response.ok) setResults(await response.json());
      } else {
        if (city) params.append('city', city);
        if (selectedTruckType !== 'Tutti') params.append('truck_type', selectedTruckType);
        if (selectedDirection !== 'Tutti') params.append('direction', selectedDirection);
        const response = await fetch(`${API_URL}/api/trucks?${params.toString()}`);
        if (response.ok) setResults(await response.json());
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizePhone = (phone: string) => { let c = phone.replace(/[^0-9]/g, ''); return c.startsWith('39') ? c : '39' + c; };
  const handleCall = (phone: string) => Linking.openURL(`tel:${phone}`);
  const handleWhatsApp = (phone: string) => Linking.openURL(`https://wa.me/${normalizePhone(phone)}`);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={user?.role === 'carrier' ? 'cube' : 'car-sport'} size={24} color={user?.role === 'carrier' ? '#4CAF50' : '#FF6B35'} />
        <Text style={styles.cardTitle}>{user?.role === 'carrier' ? `${item.origin_city} → ${item.destination_city}` : `${item.city} (${item.province})`}</Text>
      </View>
      <Text style={styles.infoText}>{user?.role === 'carrier' ? item.date : item.availability_date} • {item.truck_type}{user?.role === 'shipper' ? ` • ${item.direction}` : ''}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.phone)}><Ionicons name="call" size={20} color="#FFFFFF" /><Text style={styles.buttonText}>Chiama</Text></TouchableOpacity>
        <TouchableOpacity style={styles.whatsappButton} onPress={() => handleWhatsApp(item.phone)}><Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" /><Text style={styles.buttonText}>WhatsApp</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Cerca</Text></View>
      <View style={styles.filters}>
        {user?.role === 'carrier' ? (
          <><TextInput style={styles.input} placeholder="Città partenza" placeholderTextColor="#8B8B9E" value={originCity} onChangeText={setOriginCity} />
          <TextInput style={styles.input} placeholder="Città destinazione" placeholderTextColor="#8B8B9E" value={destinationCity} onChangeText={setDestinationCity} /></>
        ) : (
          <TextInput style={styles.input} placeholder="Città" placeholderTextColor="#8B8B9E" value={city} onChangeText={setCity} />
        )}
        <Text style={styles.filterLabel}>Tipo camion</Text>
        <View style={styles.filterRow}>{TRUCK_TYPES.map((type) => (<TouchableOpacity key={type} style={[styles.filterChip, selectedTruckType === type && styles.filterChipActive]} onPress={() => setSelectedTruckType(type)}><Text style={[styles.filterChipText, selectedTruckType === type && styles.filterChipTextActive]}>{type}</Text></TouchableOpacity>))}</View>
        {user?.role === 'shipper' && (<><Text style={styles.filterLabel}>Direzione</Text><View style={styles.filterRow}>{DIRECTIONS.map((dir) => (<TouchableOpacity key={dir} style={[styles.filterChip, selectedDirection === dir && styles.filterChipActive]} onPress={() => setSelectedDirection(dir)}><Text style={[styles.filterChipText, selectedDirection === dir && styles.filterChipTextActive]}>{dir}</Text></TouchableOpacity>))}</View></>)}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}><Ionicons name="search" size={20} color="#FFFFFF" /><Text style={styles.searchButtonText}>Cerca</Text></TouchableOpacity>
      </View>
      {isLoading ? <ActivityIndicator size="large" color="#FF6B35" style={{flex:1}} /> : (
        <FlatList data={results} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} ListEmptyComponent={searched ? <View style={styles.emptyState}><Text style={styles.emptyText}>Nessun risultato</Text></View> : null} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  header: { padding: 20, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  filters: { padding: 16, paddingTop: 0 },
  input: { backgroundColor: '#252542', borderRadius: 12, padding: 16, color: '#FFFFFF', fontSize: 16, marginBottom: 12 },
  filterLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  filterChip: { backgroundColor: '#252542', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  filterChipActive: { backgroundColor: '#FF6B35' },
  filterChipText: { color: '#8B8B9E', fontSize: 13 },
  filterChipTextActive: { color: '#FFFFFF' },
  searchButton: { backgroundColor: '#FF6B35', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 16 },
  searchButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  list: { padding: 16, paddingTop: 8 },
  card: { backgroundColor: '#252542', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginLeft: 12, flex: 1 },
  infoText: { color: '#8B8B9E', fontSize: 14 },
  cardActions: { flexDirection: 'row', marginTop: 12 },
  callButton: { flex: 1, flexDirection: 'row', backgroundColor: '#FF6B35', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  whatsappButton: { flex: 1, flexDirection: 'row', backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
