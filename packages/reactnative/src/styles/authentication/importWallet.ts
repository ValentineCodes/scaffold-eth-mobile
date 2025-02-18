import { StyleSheet } from 'react-native';
import { FONT_SIZE } from '../../utils/styles';
import globalStyles from '../globalStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: { ...globalStyles.textSemiBold },
  content: {
    marginTop: 24,
    marginBottom: 50,
    gap: 24,
    paddingHorizontal: 10
  },
  biometricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  biometricsTitle: {
    ...globalStyles.text,
    fontSize: FONT_SIZE['xl']
  },
  button: {
    paddingVertical: 5
  },
  buttonText: {
    fontSize: FONT_SIZE['lg'],
    color: 'white',
    ...globalStyles.text
  }
});
