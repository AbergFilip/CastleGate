import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import {
  Card,
  Text,
  IconButton,
  FAB,
  List,
  Searchbar,
  Chip,
} from 'react-native-paper';
import { theme } from '../theme/theme';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
}

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    // TODO: Fetch documents from API
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Passport.pdf',
        type: 'document',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Insurance Policy.pdf',
        type: 'insurance',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Bank Statement.pdf',
        type: 'financial',
        uploadedAt: new Date().toISOString(),
      },
    ];
    setDocuments(mockDocuments);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'insurance':
        return 'shield-check';
      case 'financial':
        return 'wallet';
      case 'document':
      default:
        return 'file-document';
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Sök dokument"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredDocuments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                Inga dokument ännu
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtext}>
                Tryck på + för att lägga till ditt första dokument
              </Text>
            </Card.Content>
          </Card>
        ) : (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} style={styles.documentCard}>
              <Card.Content>
                <List.Item
                  title={doc.name}
                  description={`Typ: ${doc.type}`}
                  left={(props) => (
                    <List.Icon {...props} icon={getIcon(doc.type)} color={theme.colors.primary} />
                  )}
                  right={() => (
                    <IconButton icon="dots-vertical" />
                  )}
                />
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Upload document')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchbar: {
    margin: 16,
  },
  documentCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  emptyCard: {
    margin: 16,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontWeight: 'bold',
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: 8,
    color: theme.colors.disabled,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

