import React from 'react';
import { Image } from 'react-native';
import { WINDOW_WIDTH } from '../utils/styles';

type Props = {
  size?: number;
};

export default function Logo({ size }: Props) {
  return (
    <Image
      source={require('../assets/images/logo.png')}
      style={{
        width: size || WINDOW_WIDTH * 0.3,
        height: size || WINDOW_WIDTH * 0.3
      }}
    />
  );
}
