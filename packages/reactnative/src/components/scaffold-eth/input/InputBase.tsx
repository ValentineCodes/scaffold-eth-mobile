import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { CommonInputProps } from './utils';

type Props<T> = CommonInputProps<T> & {
  error?: boolean;
  prefix?: JSX.Element | false;
  suffix?: JSX.Element | false;
};

export function InputBase<
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
    <View style={styles.container}>
      {prefix}
      <TextInput
        value={value?.toString()}
        mode="outlined"
        style={styles.input}
        contentStyle={globalStyles.text}
        outlineStyle={{ borderRadius: 24, borderWidth: 0 }}
        selectionColor={COLORS.primaryLight}
        cursorColor={COLORS.primary}
        disabled={disabled}
        placeholder={placeholder}
        onChangeText={handleChange}
        error={error}
      />
      {suffix}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: '#efefef'
  },
  input: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#efefef'
  }
});
