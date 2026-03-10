import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Errore', 'Inserisci email e password');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Login fallito');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Accedi</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#8B8B9E" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#8B8B9E" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#8B8B9E" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#8B8B9E" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#8B8B9E" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.loginButton, isLoading && styles.disabledButton]} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Accedi</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Non hai un account? <Text style={styles.registerLinkBold}>Registrati</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  keyboardView: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20 },
  backButton: { padding: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 16 },
  form: { flex: 1, padding: 24, justifyContent: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#252542', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 16 },
  loginButton: { backgroundColor: '#FF6B35', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  disabledButton: { opacity: 0.7 },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  registerLink: { color: '#8B8B9E', textAlign: 'center', marginTop: 24, fontSize: 16 },
  registerLinkBold: { color: '#FF6B35', fontWeight: '600' },
});
