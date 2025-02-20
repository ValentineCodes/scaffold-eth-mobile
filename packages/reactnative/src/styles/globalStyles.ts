import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '../utils/styles';

export default StyleSheet.create({
  logo: {
    position: 'absolute',
    top: 10,
    left: 10
  },
  scanIcon: {
    width: WINDOW_WIDTH * 0.07,
    aspectRatio: 1
  },
  text: {
    fontFamily: 'Poppins-Regular'
  },
  textBold: {
    fontFamily: 'Poppins-Bold'
  },
  textBlack: {
    fontFamily: 'Poppins-Black'
  },
  textMedium: {
    fontFamily: 'Poppins-Medium'
  },
  textSemiBold: {
    fontFamily: 'Poppins-SemiBold'
  }
});
