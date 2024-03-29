import {Dimensions, StyleSheet} from 'react-native';

const DEVICE_WIDTH = Dimensions.get("window").width

export default StyleSheet.create({
  logo: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  scanIcon: {
    width: DEVICE_WIDTH * 0.07,
    aspectRatio: 1
  }
});
