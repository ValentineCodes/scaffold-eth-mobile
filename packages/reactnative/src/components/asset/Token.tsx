import { Address } from 'abitype';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import { FONT_SIZE } from '../../utils/styles';
import Blockie from '../Blockie';

type Props = {
  address: Address;
  name: string;
  symbol: string;
  onPress?: () => void;
};

export default function Token({ address, name, symbol, onPress }: Props) {
  const { tokenMetadata } = useTokenMetadata({ token: address });
  const { balance } = useTokenBalance({ token: address });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.tokenTitle, { width: '70%' }]}>
        <Blockie address={address} size={2.5 * FONT_SIZE['xl']} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <Text>
        {tokenMetadata && balance
          ? ethers.formatUnits(balance, tokenMetadata.decimals)
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
    justifyContent: 'space-between'
  },
  tokenTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    marginLeft: 12
  }
});
