import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Card,
  Text,
  List,
  Avatar,
  Button,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={user?.fullName?.substring(0, 2) || 'CG'}
            />
            <Text variant="headlineSmall" style={styles.name}>
              {user?.fullName || 'Användare'}
            </Text>
            <Text variant="bodyMedium" style={styles.personalNumber}>
              {user?.personalNumber || ''}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.settingsCard}>
          <Card.Content>
            <List.Item
              title="Säkerhet"
              description="Private Key, Biometrics"
              left={(props) => (
                <List.Icon {...props} icon="shield-check" color={theme.colors.primary} />
              )}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color={theme.colors.disabled} />
              )}
              onPress={() => console.log('Security settings')}
            />
            <Divider />
            <List.Item
              title="Integritet"
              description="Marknadsplatsinställningar"
              left={(props) => (
                <List.Icon {...props} icon="lock" color={theme.colors.primary} />
              )}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color={theme.colors.disabled} />
              )}
              onPress={() => console.log('Privacy settings')}
            />
            <Divider />
            <List.Item
              title="Castlegate Coins"
              description="Wallet & Transaktioner"
              left={(props) => (
                <List.Icon {...props} icon="wallet" color={theme.colors.primary} />
              )}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color={theme.colors.disabled} />
              )}
              onPress={() => console.log('Wallet settings')}
            />
            <Divider />
            <List.Item
              title="Hjälp & Support"
              left={(props) => (
                <List.Icon {...props} icon="help-circle" color={theme.colors.primary} />
              )}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color={theme.colors.disabled} />
              )}
              onPress={() => console.log('Help')}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained-tonal"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor={theme.colors.error}
          textColor="white"
          icon="logout"
        >
          Logga ut
        </Button>

        <View style={styles.versionContainer}>
          <Text variant="bodySmall" style={styles.versionText}>
            CastleGate v0.1.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  personalNumber: {
    color: theme.colors.disabled,
    marginTop: 4,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  logoutButton: {
    margin: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    color: theme.colors.disabled,
  },
});

