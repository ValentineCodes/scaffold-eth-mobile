import { StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import globalStyles from '../globalStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 15
  },
  contentContainer: { flex: 1, paddingHorizontal: 10, marginTop: 20 },
  logo: {
    position: 'absolute',
    top: 15,
    left: 15
  },
  contentCaption: {
    marginVertical: 10,
    textAlign: 'center'
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 1.5 * FONT_SIZE['xl'],
    ...globalStyles.textSemiBold
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 8,
    ...globalStyles.text
  },
  formContainer: {
    marginTop: 16,
    marginBottom: 50,
    gap: 24
  },
  biometricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
