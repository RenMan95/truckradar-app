File 18: app/(tabs)/profile.tsx
"Add file" → "Create new file"
Nome: app/(tabs)/profile.tsx
Contenuto:
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const router = useRouter();
  const { user, logout, deleteAccount } = useAuth();

  const handleLogout = () => {
    Alert.alert('Conferma', 'Sei sicuro di voler uscire?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', onPress: async () => { await logout(); router.replace('/(auth)/welcome'); } },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Elimina Account', 'Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: async () => {
        try { await deleteAccount(); router.replace('/(auth)/welcome'); } 
        catch (error: any) { Alert.alert('Errore', error.message || 'Impossibile eliminare account'); }
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}><Text style={styles.title}>Profilo</Text></View>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}><Ionicons name={user?.role === 'carrier' ? 'car-sport' : 'cube'} size={48} color="#FF6B35" /></View>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}><Text style={styles.roleText}>{user?.role === 'carrier' ? 'Trasportatore' : 'Spedizioniere'}</Text></View>
          {user?.phone && <Text style={styles.phone}><Ionicons name="call" size={14} color="#8B8B9E" /> {user.phone}</Text>}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni App</Text>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Versione</Text><Text style={styles.infoValue}>1.0.0 MVP</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Scadenza annunci</Text><Text style={styles.infoValue}>24 ore</Text></View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Azioni</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}><Ionicons name="log-out" size={24} color="#FF6B35" /><Text style={styles.menuItemText}>Esci</Text><Ionicons name="chevron-forward" size={20} color="#8B8B9E" /></TouchableOpacity>
          <TouchableOpacity style={styles.menuItemDanger} onPress={handleDeleteAccount}><Ionicons name="trash" size={24} color="#FF4444" /><Text style={styles.menuItemTextDanger}>Elimina Account</Text><Ionicons name="chevron-forward" size={20} color="#8B8B9E" /></TouchableOpacity>
        </View>
        <View style={styles.footer}><Text style={styles.footerText}>TruckRadar © 2024</Text><Text style={styles.footerSubtext}>Made in Italy 🇮🇹</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  scrollContent: { flexGrow: 1 },
  header: { padding: 20, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  profileCard: { backgroundColor: '#252542', marginHorizontal: 16, borderRadius: 16, padding: 24, alignItems: 'center' },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 107, 53, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  email: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  roleBadge: { backgroundColor: '#FF6B35', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, marginTop: 12 },
  roleText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  phone: { color: '#8B8B9E', fontSize: 14, marginTop: 12 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { color: '#8B8B9E', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#252542', padding: 16, borderRadius: 12, marginBottom: 8 },
  infoLabel: { color: '#8B8B9E', fontSize: 16 },
  infoValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#252542', padding: 16, borderRadius: 12, marginBottom: 8 },
  menuItemText: { color: '#FFFFFF', fontSize: 16, flex: 1, marginLeft: 12 },
  menuItemDanger: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 68, 68, 0.1)', padding: 16, borderRadius: 12, marginBottom: 8 },
  menuItemTextDanger: { color: '#FF4444', fontSize: 16, flex: 1, marginLeft: 12 },
  footer: { alignItems: 'center', padding: 24, marginTop: 'auto' },
  footerText: { color: '#8B8B9E', fontSize: 14 },
  footerSubtext: { color: '#8B8B9E', fontSize: 12, marginTop: 4 },
});
