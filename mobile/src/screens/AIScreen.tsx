import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Card,
  Text,
  TextInput,
  IconButton,
  Chip,
  List,
  Button,
} from 'react-native-paper';
import { theme } from '../theme/theme';

export default function AIScreen() {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);

  const quickActions = [
    { label: 'Jämför produkter', icon: 'compare' },
    { label: 'Övervaka avtal', icon: 'file-document-check' },
    { label: 'Rekommendationer', icon: 'lightbulb' },
    { label: 'Säkerhetskontroll', icon: 'shield-search' },
  ];

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = {
      role: 'user',
      text: query,
      timestamp: new Date(),
    };

    setConversation((prev) => [...prev, userMessage]);
    setQuery('');

    // TODO: Call AI API
    const aiResponse = {
      role: 'assistant',
      text: 'Detta är ett mock-svar. AI-integration kommer snart!',
      timestamp: new Date(),
    };

    setTimeout(() => {
      setConversation((prev) => [...prev, aiResponse]);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.chatContainer}>
        {conversation.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <Text variant="headlineSmall" style={styles.welcomeTitle}>
              CastleGate AI-assistent
            </Text>
            <Text variant="bodyLarge" style={styles.welcomeText}>
              Din personliga assistent för att kontrollera ditt digitala liv
            </Text>

            <Text variant="titleMedium" style={styles.quickActionsTitle}>
              Snabbåtgärder
            </Text>

            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  style={styles.quickActionCard}
                  onPress={() => setQuery(action.label)}
                >
                  <Card.Content style={styles.quickActionContent}>
                    <IconButton icon={action.icon as any} size={32} iconColor={theme.colors.primary} />
                    <Text variant="bodySmall" style={styles.quickActionLabel}>
                      {action.label}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>
        ) : (
          <>
            {conversation.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  msg.role === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.messageText,
                    msg.role === 'user' ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Ställ en fråga..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          multiline
        />
        <IconButton
          icon="send"
          iconColor={theme.colors.primary}
          size={32}
          onPress={sendMessage}
          disabled={!query.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 32,
    color: theme.colors.disabled,
  },
  quickActionsTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  quickActionContent: {
    alignItems: 'center',
    paddingTop: 8,
  },
  quickActionLabel: {
    textAlign: 'center',
    marginTop: -8,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
  },
  messageText: {
    color: theme.colors.text,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: theme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: theme.colors.surface,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
});

