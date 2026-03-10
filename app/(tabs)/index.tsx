File 14: app/(tabs)/index.tsx
"Add file" → "Create new file"
Nome: app/(tabs)/index.tsx
Contenuto:
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'https://backend-production-39372.up.railway.app';

export default function Home() {
  const { user } = useAuth();
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loads, setLoads] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [trucksRes, loadsRes] = await Promise.all([
        fetch(`${API_URL}/api/trucks`),
        fetch(`${API_URL}/api/loads`),
      ]);
      if (trucksRes.ok) setTrucks(await trucksRes.json());
      if (loadsRes.ok) setLoads(await loadsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = async () => { setRefreshing(true); await fetchData(); setRefreshing(false); };

  const normalizePhone = (phone: string): string => {
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (!cleaned.startsWith('39')) cleaned = '39' + cleaned;
    return cleaned;
  };

  const handleCall = (phone: string) => Linking.openURL(`tel:${phone}`);
  const handleWhatsApp = (phone: string) => Linking.openURL(`https://wa.me/${normalizePhone(phone)}`);

  const renderTruckItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="car-sport" size={24} color="#FF6B35" />
        <Text style={styles.cardTitle}>{item.city} ({item.province})</Text>
      </View>
      <Text style={styles.infoText}>{item.availability_date} • {item.truck_type} • {item.direction}</Text>
      {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.phone)}><Ionicons name="call" size={20} color="#FFFFFF" /><Text style={styles.buttonText}>Chiama</Text></TouchableOpacity>
        <TouchableOpacity style={styles.whatsappButton} onPress={() => handleWhatsApp(item.phone)}><Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" /><Text style={styles.buttonText}>WhatsApp</Text></TouchableOpacity>
      </View>
    </View>
  );

  const renderLoadItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="cube" size={24} color="#4CAF50" />
        <Text style={styles.cardTitle}>{item.origin_city} → {item.destination_city}</Text>
      </View>
      <Text style={styles.infoText}>{item.date} • {item.truck_type}</Text>
      {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.phone)}><Ionicons name="call" size={20} color="#FFFFFF" /><Text style={styles.buttonText}>Chiama</Text></TouchableOpacity>
        <TouchableOpacity style={styles.whatsappButton} onPress={() => handleWhatsApp(item.phone)}><Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" /><Text style={styles.buttonText}>WhatsApp</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TruckRadar</Text>
        <Text style={styles.subtitle}>{user?.role === 'carrier' ? 'Trova carichi disponibili' : 'Trova camion disponibili'}</Text>
      </View>
      <FlatList
        data={user?.role === 'carrier' ? loads : trucks}
        renderItem={user?.role === 'carrier' ? renderLoadItem : renderTruckItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
        ListEmptyComponent={<View style={styles.emptyState}><Ionicons name="documents-outline" size={64} color="#8B8B9E" /><Text style={styles.emptyText}>Nessun annuncio disponibile</Text></View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  header: { padding: 20, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#8B8B9E', marginTop: 4 },
  list: { padding: 16, paddingTop: 0 },
  card: { backgroundColor: '#252542', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginLeft: 12, flex: 1 },
  infoText: { color: '#8B8B9E', fontSize: 14, marginBottom: 4 },
  notes: { color: '#CCCCCC', fontSize: 14, fontStyle: 'italic', marginTop: 8 },
  cardActions: { flexDirection: 'row', marginTop: 12 },
  callButton: { flex: 1, flexDirection: 'row', backgroundColor: '#FF6B35', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  whatsappButton: { flex: 1, flexDirection: 'row', backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginTop: 16 },
});
