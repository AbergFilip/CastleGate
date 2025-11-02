import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Card,
  Text,
  Switch,
  List,
  Chip,
  Button,
  IconButton,
} from 'react-native-paper';
import { theme } from '../theme/theme';

export default function MarketplaceScreen() {
  const [permissionEnabled, setPermissionEnabled] = useState(true);
  const [categories, setCategories] = useState({
    insurance: true,
    finance: true,
    healthcare: false,
  });

  const offers = [
    {
      id: '1',
      title: 'Bättre försäkring',
      provider: 'Insurance Plus',
      discount: '20% rabatt',
      category: 'insurance',
    },
    {
      id: '2',
      title: 'Sparräkning',
      provider: 'Finance Bank',
      discount: '3.5% ränta',
      category: 'finance',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.headerCard}>
          <Card.Content>
            <IconButton icon="castle" size={48} iconColor={theme.colors.primary} />
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Min Marknadsplats
            </Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>
              Du väljer vilka erbjudanden du vill se
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.settingsCard}>
          <Card.Content>
            <List.Item
              title="Permission Marketing"
              description="Erbjudanden baserat på dina val"
              left={(props) => (
                <List.Icon {...props} icon="hand-coin" color={theme.colors.primary} />
              )}
              right={() => (
                <Switch
                  value={permissionEnabled}
                  onValueChange={setPermissionEnabled}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Kategorier
        </Text>

        <View style={styles.chipsContainer}>
          <Chip
            icon={categories.insurance ? 'shield-check' : 'shield-off'}
            selected={categories.insurance}
            onPress={() =>
              setCategories({ ...categories, insurance: !categories.insurance })
            }
            style={styles.chip}
          >
            Försäkring
          </Chip>
          <Chip
            icon={categories.finance ? 'wallet' : 'wallet-outline'}
            selected={categories.finance}
            onPress={() =>
              setCategories({ ...categories, finance: !categories.finance })
            }
            style={styles.chip}
          >
            Finans
          </Chip>
          <Chip
            icon={categories.healthcare ? 'medical-bag' : 'medical-bag-outline'}
            selected={categories.healthcare}
            onPress={() =>
              setCategories({
                ...categories,
                healthcare: !categories.healthcare,
              })
            }
            style={styles.chip}
          >
            Hälsa
          </Chip>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Rekommenderade erbjudanden
        </Text>

        {offers.map((offer) => (
          <Card key={offer.id} style={styles.offerCard}>
            <Card.Content>
              <View style={styles.offerHeader}>
                <View style={styles.offerInfo}>
                  <Text variant="titleMedium" style={styles.offerTitle}>
                    {offer.title}
                  </Text>
                  <Text variant="bodySmall" style={styles.offerProvider}>
                    {offer.provider}
                  </Text>
                </View>
                <Chip
                  icon="tag"
                  style={[styles.discountChip, { backgroundColor: theme.colors.success }]}
                  textStyle={{ color: 'white' }}
                >
                  {offer.discount}
                </Chip>
              </View>
              <Button
                mode="contained"
                style={styles.offerButton}
                onPress={() => console.log('View offer:', offer.id)}
              >
                Visa erbjudande
              </Button>
            </Card.Content>
          </Card>
        ))}

        <View style={styles.emptyState}>
          <Text variant="bodyMedium" style={styles.emptyStateText}>
            Mer erbjudanden kommer snart
          </Text>
          <Text variant="bodySmall" style={styles.emptyStateSubtext}>
            Din marknadsplats växer när du lägger till fler dokument
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
  headerCard: {
    margin: 16,
    elevation: 4,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    textAlign: 'center',
    marginTop: 8,
    color: theme.colors.disabled,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  offerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontWeight: 'bold',
  },
  offerProvider: {
    color: theme.colors.disabled,
    marginTop: 4,
  },
  discountChip: {
    marginLeft: 8,
  },
  offerButton: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyStateSubtext: {
    textAlign: 'center',
    marginTop: 8,
    color: theme.colors.disabled,
  },
});

