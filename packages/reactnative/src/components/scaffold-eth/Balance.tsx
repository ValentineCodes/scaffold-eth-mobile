import React from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useBalance, useNetwork } from '../../hooks/scaffold-eth';
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
          ? `${Number(parseBalance(balance)).toLocaleString('en-US')} ${network.currencySymbol}`
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
