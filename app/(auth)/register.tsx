import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'carrier' | 'shipper' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !role) {
      Alert.alert('Errore', 'Compila tutti i campi obbligatori');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Errore', 'La password deve essere di almeno 6 caratteri');
      return;
    }
    setIsLoading(true);
    try {
      await register(email, password, role, phone || undefined);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Registrazione fallita');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Registrati</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Scegli il tuo ruolo</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity style={[styles.roleButton, role === 'carrier' && styles.roleButtonActive]} onPress={() => setRole('carrier')}>
                <Ionicons name="car-sport" size={32} color={role === 'carrier' ? '#FFFFFF' : '#FF6B35'} />
                <Text style={[styles.roleText, role === 'carrier' && styles.roleTextActive]}>Trasportatore</Text>
                <Text style={[styles.roleDesc, role === 'carrier' && styles.roleDescActive]}>Ho camion disponibili</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.roleButton, role === 'shipper' && styles.roleButtonActive]} onPress={() => setRole('shipper')}>
                <Ionicons name="cube" size={32} color={role === 'shipper' ? '#FFFFFF' : '#FF6B35'} />
                <Text style={[styles.roleText, role === 'shipper' && styles.roleTextActive]}>Spedizioniere</Text>
                <Text style={[styles.roleDesc, role === 'shipper' && styles.roleDescActive]}>Ho carichi da spedire</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#8B8B9E" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Email *" placeholderTextColor="#8B8B9E" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#8B8B9E" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Password * (min. 6 caratteri)" placeholderTextColor="#8B8B9E" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#8B8B9E" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color="#8B8B9E" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Telefono (opzionale)" placeholderTextColor="#8B8B9E" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>

            <TouchableOpacity style={[styles.registerButton, isLoading && styles.disabledButton]} onPress={handleRegister} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.registerButtonText}>Registrati</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Hai già un account? <Text style={styles.loginLinkBold}>Accedi</Text></Text>
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20 },
  backButton: { padding: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 16 },
  form: { flex: 1, padding: 24 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  roleButton: { flex: 1, backgroundColor: '#252542', borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 6, borderWidth: 2, borderColor: 'transparent' },
  roleButtonActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  roleText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginTop: 8 },
  roleTextActive: { color: '#FFFFFF' },
  roleDesc: { color: '#8B8B9E', fontSize: 12, marginTop: 4, textAlign: 'center' },
  roleDescActive: { color: '#FFFFFF', opacity: 0.8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#252542', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 16 },
  registerButton: { backgroundColor: '#FF6B35', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  disabledButton: { opacity: 0.7 },
  registerButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  loginLink: { color: '#8B8B9E', textAlign: 'center', marginTop: 24, fontSize: 16 },
  loginLinkBold: { color: '#FF6B35', fontWeight: '600' },
});
