import React, { useState } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  label: string;
  value?: string;
  defaultValue?: string;
  infoText?: string | boolean | null;
  errorText?: string | boolean | null;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  labelStyle?: TextStyle;
};

export default function PasswordInput({
  label,
  value,
  defaultValue,
  infoText,
  errorText,
  onChange,
  onSubmit,
  labelStyle
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      <Text variant="headlineSmall" style={[styles.label, labelStyle]}>
        {label}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          defaultValue={defaultValue}
          value={value}
          mode="outlined"
          outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
          activeOutlineColor={COLORS.primary}
          style={{ flex: 1, paddingRight: 55 }}
          contentStyle={styles.inputContent}
          left={<TextInput.Icon icon="lock" color="#a3a3a3" />}
          secureTextEntry={!show}
          placeholder="Password"
          onChangeText={onChange}
          onSubmitEditing={onSubmit}
        />

        <View style={styles.actionIconsContainer}>
          {value && (
            <Ionicons
              name="close"
              color="#a3a3a3"
              size={FONT_SIZE['xl'] * 1.3}
              onPress={() => onChange('')}
            />
          )}
          <Ionicons
            name={show ? 'eye' : 'eye-off'}
            color="#a3a3a3"
            size={FONT_SIZE['xl'] * 1.3}
            onPress={() => setShow(!show)}
          />
        </View>
      </View>

      {infoText ? (
        <Text variant="bodySmall" style={styles.infoText}>
          {infoText}
        </Text>
      ) : null}
      {errorText ? (
        <Text variant="bodySmall" style={styles.errorText}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: FONT_SIZE['xl'],
    ...globalStyles.textMedium
  },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  inputContent: {
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  },
  infoText: {
    color: '#a3a3a3',
    ...globalStyles.text
  },
  errorText: {
    color: '#ef4444',
    ...globalStyles.text
  },
  actionIconsContainer: {
    flexDirection: 'row',
    gap: 5,
    position: 'absolute',
    right: 10
  }
});
