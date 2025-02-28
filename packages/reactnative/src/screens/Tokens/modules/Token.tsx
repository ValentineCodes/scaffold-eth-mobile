import { Address } from 'abitype';
import { ethers } from 'ethers';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Blockie from '../../../components/scaffold-eth/Blockie';
import { useERC20Balance, useERC20Metadata } from '../../../hooks/scaffold-eth';
import globalStyles from '../../../styles/globalStyles';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  address: Address;
  name: string;
  symbol: string;
  onPress?: () => void;
};

export default function Token({ address, name, symbol, onPress }: Props) {
  const { data: tokenMetadata } = useERC20Metadata({ token: address });
  const { balance } = useERC20Balance({ token: address });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.tokenTitle, { width: '70%' }]}>
        <Blockie address={address} size={2.5 * FONT_SIZE['xl']} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <Text style={styles.balance}>
        {tokenMetadata && balance
          ? Number(
              ethers.formatUnits(balance, tokenMetadata.decimals)
            ).toLocaleString('en-US')
          : null}{' '}
        {symbol}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  tokenTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    marginLeft: 12,
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  },
  balance: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.text
  }
});
