import { formatEther } from 'ethers';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useCryptoPrice } from '../../../hooks/useCryptoPrice';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  amount: string;
  token: string;
  balance: bigint | null;
  gasCost: bigint | null;
  isNativeToken?: boolean;
  onChange: (value: string) => void;
  onConfirm: () => void;
};

export default function Amount({
  amount,
  token,
  balance,
  gasCost,
  isNativeToken,
  onChange,
  onConfirm
}: Props) {
  const [error, setError] = useState('');
  const [dollarValue, setDollarValue] = useState('');
  const [isDollar, setIsDollar] = useState(false);

  const toast = useToast();

  const {
    price: dollarRate,
    loading: isFetchingDollarRate,
    fetchPrice: fetchDollarRate
  } = useCryptoPrice({ enabled: isNativeToken });

  const switchCurrency = () => {
    if (!dollarRate) {
      toast.show('Loading exchange rate');

      if (!isFetchingDollarRate) {
        fetchDollarRate();
      }

      return;
    }

    setIsDollar(prev => !prev);
  };

  const validateInput = (value: string) => {
    if (!isNativeToken) return;

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

  const handleInputChange = (value: string) => {
    if (value.trim() === '') {
      onChange('');
      setDollarValue('');
      setError('');
      return;
    }

    // Ensure only valid floating numbers are parsed
    const numericValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except `.`
    if (!/^\d*\.?\d*$/.test(numericValue) || numericValue == '') return; // Ensure valid decimal format

    let nativeValue = numericValue;
    if (!dollarRate) {
      onChange(numericValue);
      return;
    }

    if (isDollar) {
      setDollarValue(numericValue);
      nativeValue = (parseFloat(numericValue) / dollarRate).toString();
      onChange(nativeValue);
    } else {
      onChange(numericValue);
      setDollarValue((parseFloat(numericValue) * dollarRate).toFixed(2));
    }

    validateInput(nativeValue);
  };

  const displayValue = isDollar ? dollarValue : amount;
  const displayConversion = isDollar ? amount : dollarValue;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={globalStyles.text}>
          Amount:
        </Text>
        {isNativeToken && (
          <Pressable onPress={switchCurrency}>
            <Text style={styles.conversionText}>
              {isDollar ? 'USD' : token}
            </Text>
          </Pressable>
        )}
      </View>

      <TextInput
        value={displayValue}
        mode="outlined"
        style={styles.input}
        placeholder={`0 ${token}`}
        onChangeText={handleInputChange}
        onSubmitEditing={onConfirm}
        keyboardType="number-pad"
        error={!!error}
        outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
        contentStyle={globalStyles.text}
      />

      {isNativeToken && (
        <Text variant="bodySmall" style={globalStyles.text}>
          ~{!isDollar && '$'}
          {displayConversion} {isDollar && token}
        </Text>
      )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 8
  },
  conversionText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    ...globalStyles.textMedium,
    marginLeft: 2,
    marginBottom: -2
  },
  input: {
    backgroundColor: '#f5f5f5'
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    ...globalStyles.text
  }
});
