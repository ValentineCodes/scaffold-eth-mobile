import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface IMessageProps {
  message: string;
}

export function Message({ message }: IMessageProps) {
  return (
    <View style={styles.methodsContainer}>
      <Text variant="bodyMedium" style={styles.methodEventsTitle}>
        Message
      </Text>
      <ScrollView
        showsVerticalScrollIndicator
        contentContainerStyle={styles.messageContainer}
      >
        <Text variant="bodyMedium" style={styles.messageText}>
          {message}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxHeight: 200
  },
  methodsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  messageText: {
    fontWeight: '500',
    paddingHorizontal: 6,
    color: '#585F5F'
  },
  methodEventsTitle: {
    color: 'rgba(121, 134, 134, 1)',
    fontWeight: '600',
    paddingLeft: 6,
    paddingVertical: 4
  }
});
