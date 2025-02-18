import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import globalStyles from '../styles/globalStyles';

type Props = {
  text: string;
};

export default function BulletText({ text }: Props) {
  return (
    <View style={styles.container}>
      <Text variant="bodyLarge" style={styles.bullet}>
        •
      </Text>
      <Text variant="bodyLarge" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 8
  },
  bullet: {
    fontSize: 18,
    ...globalStyles.text
  },
  text: {
    flex: 1,
    ...globalStyles.text
  }
});
