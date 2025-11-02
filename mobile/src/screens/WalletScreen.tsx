import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  List,
  Chip,
  Divider,
} from 'react-native-paper';
import { theme } from '../theme/theme';

export default function WalletScreen() {
  const [balance, setBalance] = useState('0.0');
  const [address, setAddress] = useState('0x0000...0000');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    // TODO: Fetch wallet data from API
    setBalance('1,234.56');
    setAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0');
  };

  const transactions = [
    {
      id: '1',
      type: 'received',
      amount: '+100 CGC',
      from: 'CastleGate Airdrop',
      timestamp: '2025-01-01',
    },
    {
      id: '2',
      type: 'sent',
      amount: '-50 CGC',
      to: '0x1234...5678',
      timestamp: '2024-12-25',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.walletCard}>
          <Card.Content>
            <Text variant="bodyLarge" style={styles.walletLabel}>
              Ditt saldo
            </Text>
            <Text variant="headlineLarge" style={styles.balance}>
              {balance} CGC
            </Text>
            <Text variant="bodySmall" style={styles.address}>
              {address}
            </Text>

            <View style={styles.actions}>
              <Button mode="contained" icon="arrow-down" style={styles.actionButton}>
                Ta emot
              </Button>
              <Button mode="outlined" icon="arrow-up" style={styles.actionButton}>
                Skicka
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <List.Item
              title="Private Key"
              description="Säkerställd med Biometrics"
              left={(props) => (
                <List.Icon {...props} icon="key" color={theme.colors.primary} />
              )}
              right={(props) => (
                <IconButton {...props} icon="shield-check" iconColor={theme.colors.success} />
              )}
            />
          </Card.Content>
        </Card>

        <View style={styles.transactionsHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Transaktioner
          </Text>
        </View>

        {transactions.map((tx, index) => (
          <View key={tx.id}>
            <Card style={styles.transactionCard}>
              <Card.Content>
                <View style={styles.transactionRow}>
                  <View style={styles.transactionInfo}>
                    <Text variant="bodyLarge" style={styles.transactionLabel}>
                      {tx.type === 'received' ? tx.from : 'To: ' + tx.to}
                    </Text>
                    <Text variant="bodySmall" style={styles.transactionDate}>
                      {tx.timestamp}
                    </Text>
                  </View>
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.transactionAmount,
                      tx.type === 'received' ? styles.received : styles.sent,
                    ]}
                  >
                    {tx.amount}
                  </Text>
                </View>
              </Card.Content>
            </Card>
            {index < transactions.length - 1 && <Divider />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  walletCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: theme.colors.primary,
  },
  walletLabel: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  balance: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginTop: 8,
  },
  address: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  transactionsHeader: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  transactionCard: {
    marginHorizontal: 16,
    elevation: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionLabel: {
    fontWeight: '600',
  },
  transactionDate: {
    color: theme.colors.disabled,
    marginTop: 4,
  },
  transactionAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  received: {
    color: theme.colors.success,
  },
  sent: {
    color: theme.colors.error,
  },
});

