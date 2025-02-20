import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  value?: string;
  infoText?: string | null;
  errorText?: string | null;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onBlur?: () => void;
};

export default function SeedPhraseInput({
  value,
  infoText,
  errorText,
  onChange,
  onSubmit,
  onBlur
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>Seed Phrase</Text>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          style={{ flex: 1, paddingRight: 55, paddingVertical: 5 }}
          contentStyle={styles.inputContent}
          outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
          activeOutlineColor={COLORS.primary}
          value={value}
          secureTextEntry={!show}
          multiline={show}
          placeholder="Seed Phrase"
          onChangeText={onChange}
          onSubmitEditing={onSubmit}
          onBlur={onBlur}
          selectionColor={COLORS.primary}
          cursorColor="#303030"
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

      {infoText ? <Text style={styles.infoText}>{infoText}</Text> : null}
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
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
  actionIconsContainer: {
    flexDirection: 'row',
    gap: 5,
    position: 'absolute',
    right: 10
  },
  infoText: {
    color: '#a3a3a3',
    ...globalStyles.text
  },
  errorText: {
    color: '#ef4444',
    ...globalStyles.text
  }
});
