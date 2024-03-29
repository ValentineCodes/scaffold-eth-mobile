import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  mnemonicWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  mnemonicMask: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#313234',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
});
