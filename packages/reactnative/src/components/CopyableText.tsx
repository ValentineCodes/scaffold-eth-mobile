import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';

type Props = {
  value: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: TextStyle;
  displayText?: string;
};

export default function CopyableText({
  value,
  containerStyle,
  textStyle,
  iconStyle,
  displayText
}: Props) {
  const toast = useToast();

  const copy = () => {
    Clipboard.setString(value);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  return (
    <TouchableOpacity onPress={copy} style={[styles.container, containerStyle]}>
      <Text style={[styles.text, textStyle]}>{displayText || value}</Text>
      <IconButton
        icon="content-copy"
        size={20}
        style={[styles.icon, iconStyle]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    fontWeight: '500'
  },
  icon: {
    margin: 0
  }
});
