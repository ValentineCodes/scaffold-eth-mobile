import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { COLORS } from '../utils/constants';

type Props = {
  text: string;
  type?: 'normal' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  onPress: () => void;
};

export default function Button({
  text,
  type,
  loading,
  disabled,
  style,
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
      labelStyle={[styles.label, type === 'outline' && styles.outlineLabel]}
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
    backgroundColor: '#E8F7ED'
  },
  disabledButton: {
    backgroundColor: '#2A974D'
  },
  content: {
    paddingVertical: 8
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  outlineLabel: {
    color: COLORS.primary
  }
});
