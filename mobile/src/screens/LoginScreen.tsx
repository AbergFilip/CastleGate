import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';
import * as LocalAuthentication from 'react-native-biometrics';

export default function LoginScreen() {
  const [personalNumber, setPersonalNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleBankIDLogin = async () => {
    if (!personalNumber || personalNumber.length !== 12) {
      Alert.alert('Fel', 'Ange ett giltigt personnummer (YYYYMMDDXXXX)');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual BankID authentication
      // Mock authentication for now
      const mockToken = 'mock-jwt-token';
      const mockUser = {
        id: 'user-1',
        personalNumber,
        fullName: 'John Doe',
      };

      await login(mockToken, mockUser);
    } catch (error) {
      Alert.alert('Inloggning misslyckades', 'Försök igen');
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const biometrics = new LocalAuthentication.ReactNativeBiometrics({
        allowDeviceCredentials: true,
      });

      const { available } = await biometrics.simplePrompt({
        promptMessage: 'Konfirmera inloggning',
      });

      if (available) {
        // TODO: Get stored user and login
        Alert.alert('Biometrisk inloggning', 'Kommer snart');
      }
    } catch (error) {
      console.error('Biometric login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              CastleGate
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Din digitala livskontroll
            </Text>

            <TextInput
              label="Personnummer"
              value={personalNumber}
              onChangeText={setPersonalNumber}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              maxLength={12}
            />

            <Button
              mode="contained"
              onPress={handleBankIDLogin}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Logga in med BankID
            </Button>

            <Button
              mode="outlined"
              onPress={handleBiometricLogin}
              style={styles.button}
              icon="fingerprint"
            >
              Biometrisk inloggning
            </Button>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: theme.colors.text,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

