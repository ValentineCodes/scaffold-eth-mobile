import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  logo: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  contentCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
  },
  contentCaption: {
    marginVertical: 10,
    textAlign: 'center',
  },
});
