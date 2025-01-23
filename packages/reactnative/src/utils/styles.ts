import { Dimensions } from 'react-native';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

const sm = WINDOW_HEIGHT * 0.014;
const md = WINDOW_HEIGHT * 0.017;
const lg = WINDOW_HEIGHT * 0.02;
const xl = WINDOW_HEIGHT * 0.023;

export const FONT_SIZE = {
  sm,
  md,
  lg,
  xl
};
