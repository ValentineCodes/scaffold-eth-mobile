import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import BackButton from '../../components/buttons/BackButton';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';

type Props = {};

export default function WalletSetup({}: Props) {
  const navigation = useNavigation();
  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContentContainer}
      style={styles.container}
    >
      <BackButton style={styles.navBtn} />
      <Image
        source={require('../../assets/icons/wallet_icon.png')}
        style={{
          width: WINDOW_WIDTH * 0.5,
          height: WINDOW_WIDTH * 0.5
        }}
      />

      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Wallet Setup
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Create your new Wallet or import using a seed phrase if you already
          have an account
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreatePassword')}
          style={styles.createButton}
          labelStyle={[styles.buttonText, { color: 'white' }]}
        >
          Create a New Wallet
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('ImportWallet')}
          style={styles.importButton}
          labelStyle={styles.buttonText}
        >
          Import Using Seed Phrase
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'white'
  },
  navBtn: {
    position: 'absolute',
    top: 10,
    left: 0
  },
  content: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 10
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: FONT_SIZE['xl'] * 1.8,
    marginTop: 40,
    ...globalStyles.textBold
  },
  subtitle: {
    textAlign: 'center',
    fontSize: FONT_SIZE['md'],
    marginVertical: 16,
    ...globalStyles.text
  },
  createButton: {
    marginTop: 40,
    paddingVertical: 5
  },
  importButton: {
    marginTop: 20,
    paddingVertical: 5,
    borderColor: COLORS.primary
  },
  buttonText: {
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  }
});
