import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  style?: ViewStyle;
};

export default function BackButton({ style }: Props) {
  const navigation = useNavigation();
  return (
    <IconButton
      icon={() => (
        <Ionicons
          name="arrow-back-outline"
          size={1.3 * FONT_SIZE['xl']}
          color="black"
        />
      )}
      onPress={() => navigation.goBack()}
      style={style}
    />
  );
}
