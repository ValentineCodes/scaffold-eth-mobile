import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { COLORS } from '../../utils/constants';
import { truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';
import Blockie from '../Blockie';

type Props = {
  address: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: TextStyle;
};

export default function Address({
  address,
  containerStyle,
  textStyle,
  iconStyle
}: Props) {
  const toast = useToast();

  const copy = () => {
    Clipboard.setString(address);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Blockie address={address} size={1.3 * FONT_SIZE['xl']} />
      <Text variant="bodyMedium" style={[styles.text, textStyle]}>
        {truncateAddress(address)}
      </Text>
      <IconButton
        icon="content-copy"
        size={20}
        iconColor={COLORS.primary}
        onPress={copy}
        style={[styles.icon, iconStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4
  },
  text: {
    textAlign: 'center',
    fontWeight: '500'
  },
  icon: {
    margin: 0
  }
});
