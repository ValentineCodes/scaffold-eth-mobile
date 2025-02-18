import React from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { Text } from 'react-native-paper';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import globalStyles from '../../styles/globalStyles';
import { parseBalance } from '../../utils/helperFunctions';

type Props = {
  address: string;
  style?: TextStyle;
};

export default function Balance({ address, style }: Props) {
  const network = useNetwork();
  const { balance, isLoading } = useBalance({ address });

  if (isLoading) return;

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.text, style]}>
        {balance !== null
          ? `${parseBalance(balance)} ${network.currencySymbol}`
          : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});
