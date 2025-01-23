import React, { useCallback } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLORS } from '../../../utils/constants';
import { CommonInputProps } from './utils';

type Props<T> = CommonInputProps<T> & {
  error?: boolean;
  prefix?: JSX.Element | false;
  suffix?: JSX.Element | false;
};

export default function InputBase<
  T extends { toString: () => string } | undefined = string
>({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  prefix,
  suffix
}: Props<T>) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value as unknown as T);
    },
    [onChange]
  );

  return (
    <View>
      <TextInput
        value={value?.toString()}
        mode="outlined"
        style={{
          borderRadius: 24,
          marginTop: 4
        }}
        outlineColor={COLORS.primary}
        activeOutlineColor={COLORS.primary}
        selectionColor={COLORS.primary}
        cursorColor={COLORS.primary}
        disabled={disabled}
        placeholder={placeholder}
        onChangeText={handleChange}
        left={prefix}
        right={suffix}
        error={error}
      />
    </View>
  );
}
