import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { FONT_SIZE } from '../../utils/styles';
import Blockie from '../Blockie';

type Props = {};

export default function Token({}: Props) {
  return (
    <Pressable style={styles.container}>
      <View style={[styles.tokenTitle, { width: '70%' }]}>
        <Blockie
          address={'0x98b12DD3419507BE069167E1D7c2cFC819859706'}
          size={2.5 * FONT_SIZE['xl']}
        />
        <Text style={styles.name}>Ethereum</Text>
      </View>

      <View style={styles.balance}>
        <Text>$0.00</Text>
        <Text>0 DAI</Text>
      </View>
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
  },
  balance: {
    marginLeft: 12
  }
});
