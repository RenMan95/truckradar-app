import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'https://backend-production-39372.up.railway.app';

export default function MyListings() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyListings = useCallback(async () => {
    if (!token) return;
    try {
      const endpoint = user?.role === 'carrier' ? '/api/trucks/my' : '/api/loads/my';
      const response = await fetch(`${API_URL}${endpoint}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) setListings(await response.json());
    } catch (error) { console.error('Error fetching listings:', error); } 
    finally { setIsLoading(false); }
  }, [token, user?.role]);

  useEffect(() => { fetchMyListings(); }, [fetchMyListings]);

  const onRefresh = async () => { setRefreshing(true); await fetchMyListings(); setRefreshing(false); };

  const handleDelete = (id: string) => {
    Alert.alert('Conferma', 'Sei sicuro di voler eliminare questo annuncio?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: async () => {
        try {
          const endpoint = user?.role === 'carrier' ? `/api/trucks/${id}` : `/api/loads/${id}`;
          const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
          if (response.ok) { setListings(listings.filter((l) => l.id !== id)); Alert.alert('Successo', 'Annuncio eliminato'); }
          else Alert.alert('Errore', 'Impossibile eliminare annuncio');
        } catch (error) { Alert.alert('Errore', 'Errore di connessione'); }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={user?.role === 'carrier' ? 'car-sport' : 'cube'} size={24} color={user?.role === 'carrier' ? '#FF6B35' : '#4CAF50'} />
        <Text style={styles.cardTitle}>{user?.role === 'carrier' ? `${item.city} (${item.province})` : `${item.origin_city} → ${item.destination_city}`}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}><Ionicons name="trash" size={20} color="#FF4444" /></TouchableOpacity>
      </View>
      <Text style={styles.infoText}>{user?.role === 'carrier' ? `${item.availability_date} • ${item.truck_type} • ${item.direction}` : `${item.date} • ${item.truck_type}`}</Text>
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusExpired]}>
          <Text style={styles.statusText}>{item.status === 'active' ? 'Attivo' : 'Scaduto'}</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#FF6B35" style={{flex:1}} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>I Miei Annunci</Text><Text style={styles.subtitle}>{listings.length} {listings.length === 1 ? 'annuncio' : 'annunci'}</Text></View>
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
        ListEmptyComponent={<View style={styles.emptyState}><Ionicons name="documents-outline" size={64} color="#8B8B9E" /><Text style={styles.emptyText}>Nessun annuncio</Text><Text style={styles.emptySubtext}>Pubblica il tuo primo annuncio</Text></View>}
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
  deleteButton: { padding: 8 },
  infoText: { color: '#8B8B9E', fontSize: 14 },
  statusRow: { flexDirection: 'row', marginTop: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusActive: { backgroundColor: 'rgba(76, 175, 80, 0.2)' },
  statusExpired: { backgroundColor: 'rgba(255, 68, 68, 0.2)' },
  statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginTop: 16 },
  emptySubtext: { color: '#8B8B9E', fontSize: 14, marginTop: 8 },
});
