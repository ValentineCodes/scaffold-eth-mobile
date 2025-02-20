import React from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  text: string;
  type?: 'normal' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  onPress: () => void;
};

export default function CustomButton({
  text,
  type,
  loading,
  disabled,
  style,
  labelStyle,
  onPress
}: Props) {
  return (
    <PaperButton
      mode={type === 'outline' ? 'outlined' : 'contained'}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[
        styles.button,
        type === 'outline' && styles.outlineButton,
        disabled && styles.disabledButton,
        style
      ]}
      contentStyle={styles.content}
      labelStyle={[
        styles.label,
        type === 'outline' && styles.outlineLabel,
        labelStyle
      ]}
    >
      {text}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    width: '100%'
  },
  outlineButton: {
    backgroundColor: '#E8F7ED',
    borderColor: COLORS.gray
  },
  disabledButton: {
    backgroundColor: '#2A974D'
  },
  content: {
    paddingVertical: 8
  },
  label: {
    fontSize: FONT_SIZE['lg'],
    color: 'white',
    ...globalStyles.text
  },
  outlineLabel: {
    color: COLORS.primary
  }
});
