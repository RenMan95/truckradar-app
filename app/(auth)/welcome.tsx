import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="car-sport" size={80} color="#FF6B35" />
          <Text style={styles.title}>TruckRadar</Text>
          <Text style={styles.subtitle}>Connetti trasportatori e spedizionieri</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="location" size={24} color="#FF6B35" />
            <Text style={styles.featureText}>Trova camion disponibili nella tua zona</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="cube" size={24} color="#FF6B35" />
            <Text style={styles.featureText}>Pubblica carichi da trasportare</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="call" size={24} color="#FF6B35" />
            <Text style={styles.featureText}>Contatta direttamente via telefono o WhatsApp</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.primaryButtonText}>Registrati</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.secondaryButtonText}>Accedi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  logoContainer: { alignItems: 'center', marginTop: 60 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF', marginTop: 16 },
  subtitle: { fontSize: 16, color: '#8B8B9E', marginTop: 8, textAlign: 'center' },
  features: { marginVertical: 40 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 16 },
  featureText: { color: '#FFFFFF', fontSize: 16, marginLeft: 16, flex: 1 },
  buttons: { marginBottom: 40 },
  primaryButton: { backgroundColor: '#FF6B35', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  secondaryButton: { backgroundColor: 'transparent', paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: '#FF6B35' },
  secondaryButtonText: { color: '#FF6B35', fontSize: 18, fontWeight: '600' },
});
