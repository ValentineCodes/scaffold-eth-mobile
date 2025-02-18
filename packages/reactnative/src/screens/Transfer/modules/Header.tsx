import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import BackButton from '../../../components/buttons/BackButton';
import globalStyles from '../../../styles/globalStyles';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  token: string;
};

export default function Header({ token }: Props) {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Send {token}</Text>
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
    marginLeft: 8,
    fontSize: FONT_SIZE['xl'] * 1.2,
    ...globalStyles.textMedium,
    marginBottom: -2
  }
});
