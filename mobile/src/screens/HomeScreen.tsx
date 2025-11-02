import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Card,
  Text,
  FAB,
  IconButton,
  Chip,
  Avatar,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();

  const statCards = [
    { title: 'Dokument', value: '12', icon: 'file-document', color: theme.colors.primary },
    { title: 'Tillgångar', value: '3', icon: 'wallet', color: theme.colors.secondary },
    { title: 'CGC', value: '1,234', icon: 'currency-btc', color: theme.colors.accent },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <View style={styles.header}>
              <Avatar.Text size={64} label={user?.fullName?.substring(0, 2) || 'CG'} />
              <View style={styles.headerText}>
                <Text variant="headlineSmall">Välkommen</Text>
                <Text variant="bodyLarge">{user?.fullName || 'Användare'}</Text>
              </View>
              <IconButton
                icon="account-circle"
                size={32}
                onPress={() => navigation.navigate('Profile')}
              />
            </View>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Snabböversikt
        </Text>

        <View style={styles.statsContainer}>
          {statCards.map((stat, index) => (
            <Card
              key={index}
              style={[styles.statCard, { borderTopColor: stat.color, borderTopWidth: 4 }]}
            >
              <Card.Content>
                <IconButton icon={stat.icon as any} iconColor={stat.color} size={32} />
                <Text variant="headlineMedium" style={styles.statValue}>
                  {stat.value}
                </Text>
                <Text variant="bodyMedium" style={styles.statTitle}>
                  {stat.title}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          AI-rekommendationer
        </Text>

        <Card style={styles.recommendationCard}>
          <Card.Content>
            <Chip icon="lightbulb" style={styles.chip}>
              Nytt erbjudande
            </Chip>
            <Text variant="bodyLarge" style={styles.recommendationText}>
              Hitta bättre försäkring – spara upp till 20%
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Documents')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  welcomeCard: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  sectionTitle: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    margin: 8,
    elevation: 2,
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  statTitle: {
    color: theme.colors.disabled,
  },
  recommendationCard: {
    margin: 16,
    elevation: 2,
  },
  chip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    marginTop: 4,
  },
  bottomPadding: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

