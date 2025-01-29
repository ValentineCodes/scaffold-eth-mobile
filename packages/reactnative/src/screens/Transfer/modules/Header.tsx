import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

type Props = {
  token: string;
};

export default function Header({ token }: Props) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
      />
      <Text variant="headlineMedium" style={styles.title}>
        Send {token}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    marginLeft: 8
  }
});
