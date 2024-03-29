import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  selectedMnemonic: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  mnemonicWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  word: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  selectedWord: {
    backgroundColor: 'grey',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
});
