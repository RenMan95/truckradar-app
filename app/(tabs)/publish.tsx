import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'https://backend-production-39372.up.railway.app';
const TRUCK_TYPES = ['Bilico telonato', 'Bilico frigo', 'Motrice', 'Furgone', 'Altro'];
const DIRECTIONS = ['Nord', 'Sud', 'Centro', 'Ovunque'];

export default function Publish() {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [selectedTruckType, setSelectedTruckType] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [loadDate, setLoadDate] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');

  const resetForm = () => { setCity(''); setProvince(''); setAvailabilityDate(''); setSelectedTruckType(''); setSelectedDirection(''); setOriginCity(''); setDestinationCity(''); setLoadDate(''); setNotes(''); };

  const handlePublish = async () => {
    if (user?.role === 'carrier') {
      if (!city || !province || !availabilityDate || !selectedTruckType || !selectedDirection || !phone) { Alert.alert('Errore', 'Compila tutti i campi obbligatori'); return; }
    } else {
      if (!originCity || !destinationCity || !loadDate || !selectedTruckType || !phone) { Alert.alert('Errore', 'Compila tutti i campi obbligatori'); return; }
    }
    setIsLoading(true);
    try {
      const endpoint = user?.role === 'carrier' ? '/api/trucks' : '/api/loads';
      const body = user?.role === 'carrier' 
        ? { city, province, availability_date: availabilityDate, truck_type: selectedTruckType, direction: selectedDirection, phone, notes: notes || undefined }
        : { origin_city: originCity, destination_city: destinationCity, date: loadDate, truck_type: selectedTruckType, phone, notes: notes || undefined };
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (response.ok) { Alert.alert('Successo', 'Annuncio pubblicato con successo!'); resetForm(); } 
      else { const error = await response.json(); Alert.alert('Errore', error.detail || 'Pubblicazione fallita'); }
    } catch (error) { Alert.alert('Errore', 'Errore di connessione'); } 
    finally { setIsLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}><Text style={styles.title}>Pubblica</Text><Text style={styles.subtitle}>{user?.role === 'carrier' ? 'Pubblica disponibilità camion' : 'Pubblica carico da trasportare'}</Text></View>
          <View style={styles.form}>
            {user?.role === 'carrier' ? (
              <><TextInput style={styles.input} placeholder="Città *" placeholderTextColor="#8B8B9E" value={city} onChangeText={setCity} />
              <TextInput style={styles.input} placeholder="Provincia/CAP *" placeholderTextColor="#8B8B9E" value={province} onChangeText={setProvince} />
              <TextInput style={styles.input} placeholder="Data disponibilità * (es. 2024-12-15)" placeholderTextColor="#8B8B9E" value={availabilityDate} onChangeText={setAvailabilityDate} />
              <Text style={styles.sectionTitle}>Direzione preferita *</Text>
              <View style={styles.optionRow}>{DIRECTIONS.map((dir) => (<TouchableOpacity key={dir} style={[styles.optionChip, selectedDirection === dir && styles.optionChipActive]} onPress={() => setSelectedDirection(dir)}><Text style={[styles.optionChipText, selectedDirection === dir && styles.optionChipTextActive]}>{dir}</Text></TouchableOpacity>))}</View></>
            ) : (
              <><TextInput style={styles.input} placeholder="Città partenza *" placeholderTextColor="#8B8B9E" value={originCity} onChangeText={setOriginCity} />
              <TextInput style={styles.input} placeholder="Città destinazione *" placeholderTextColor="#8B8B9E" value={destinationCity} onChangeText={setDestinationCity} />
              <TextInput style={styles.input} placeholder="Data carico * (es. 2024-12-15)" placeholderTextColor="#8B8B9E" value={loadDate} onChangeText={setLoadDate} /></>
            )}
            <Text style={styles.sectionTitle}>Tipo camion *</Text>
            <View style={styles.optionRow}>{TRUCK_TYPES.map((type) => (<TouchableOpacity key={type} style={[styles.optionChip, selectedTruckType === type && styles.optionChipActive]} onPress={() => setSelectedTruckType(type)}><Text style={[styles.optionChipText, selectedTruckType === type && styles.optionChipTextActive]}>{type}</Text></TouchableOpacity>))}</View>
            <TextInput style={styles.input} placeholder="Telefono *" placeholderTextColor="#8B8B9E" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Note (opzionale)" placeholderTextColor="#8B8B9E" value={notes} onChangeText={setNotes} multiline numberOfLines={3} />
            <TouchableOpacity style={[styles.publishButton, isLoading && styles.disabledButton]} onPress={handlePublish} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <><Ionicons name="add-circle" size={20} color="#FFFFFF" /><Text style={styles.publishButtonText}>Pubblica Annuncio</Text></>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: { padding: 20, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#8B8B9E', marginTop: 4 },
  form: { padding: 16, paddingTop: 0 },
  input: { backgroundColor: '#252542', borderRadius: 12, padding: 16, color: '#FFFFFF', fontSize: 16, marginBottom: 12 },
  textArea: { height: 100, textAlignVertical: 'top' },
  sectionTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 12 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  optionChip: { backgroundColor: '#252542', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  optionChipActive: { backgroundColor: '#FF6B35' },
  optionChipText: { color: '#8B8B9E', fontSize: 14 },
  optionChipTextActive: { color: '#FFFFFF' },
  publishButton: { backgroundColor: '#FF6B35', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, marginTop: 24 },
  disabledButton: { opacity: 0.7 },
  publishButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginLeft: 8 },
});
