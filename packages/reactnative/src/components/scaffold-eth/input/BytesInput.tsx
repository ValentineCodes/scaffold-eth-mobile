import { useCallback } from 'react';
import { Text, TouchableRipple } from 'react-native-paper';
import { bytesToString, isHex, toBytes, toHex } from 'viem';
import { InputBase } from '.';
import { CommonInputProps } from './utils';

export function BytesInput({
  value,
  onChange,
  name,
  placeholder,
  disabled
}: CommonInputProps) {
  const convertStringToBytes = useCallback(() => {
    onChange(
      isHex(value) ? bytesToString(toBytes(value)) : toHex(toBytes(value))
    );
  }, [onChange, value]);

  return (
    <InputBase
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      suffix={
        <TouchableRipple
          onPress={convertStringToBytes}
          style={{ paddingHorizontal: 16 }}
        >
          <Text variant="bodyLarge" style={{ fontWeight: '600' }}>
            #
          </Text>
        </TouchableRipple>
      }
    />
  );
}
