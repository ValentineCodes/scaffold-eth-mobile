import { StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15
  },
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
    fontSize: 1.7 * FONT_SIZE['xl'],
    fontWeight: 'bold'
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 8
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
  }
});
