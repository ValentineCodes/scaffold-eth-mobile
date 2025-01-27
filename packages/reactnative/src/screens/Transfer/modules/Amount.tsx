import { formatEther } from 'ethers';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

type Props = {
  amount: string;
  isNativeToken?: boolean;
  token: string;
  balance: bigint | null;
  gasCost: bigint | null;
  isToken?: boolean;
  onChange: (value: string) => void;
  onConfirm: () => void;
};

export default function Amount({
  amount,
  token,
  balance,
  gasCost,
  isToken,
  onChange,
  onConfirm
}: Props) {
  const [error, setError] = useState('');

  const handleInputChange = (value: string) => {
    onChange(value);

    if (isToken) return;

    let amount = Number(value);

    if (value.trim() && balance && !isNaN(amount) && gasCost) {
      if (amount >= Number(formatEther(balance))) {
        setError('Insufficient amount');
      } else if (Number(formatEther(balance - gasCost)) < amount) {
        setError('Insufficient amount for gas');
      } else if (error) {
        setError('');
      }
    } else if (error) {
      setError('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Amount:</Text>
      </View>

      <TextInput
        value={amount}
        mode="outlined"
        style={styles.input}
        placeholder={`0 ${token}`}
        onChangeText={handleInputChange}
        onSubmitEditing={onConfirm}
        keyboardType="number-pad"
        error={!!error}
      />

      {error && (
        <Text variant="bodySmall" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24
  },
  header: {},
  input: {
    backgroundColor: '#f5f5f5'
  },
  errorText: {
    color: 'red',
    marginTop: 4
  }
});
