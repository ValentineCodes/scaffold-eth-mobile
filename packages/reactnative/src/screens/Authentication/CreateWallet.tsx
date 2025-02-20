import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import BackButton from '../../components/buttons/BackButton';
import SeedPhrase from '../../components/SeedPhrase';
import useWallet from '../../hooks/scaffold-eth/useWallet';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { initAccounts } from '../../store/reducers/Accounts';
import { loginUser } from '../../store/reducers/Auth';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

interface Wallet {
  mnemonic: string;
  privateKey: string;
  address: string;
}

type Props = {};

export default function CreateWallet({}: Props) {
  const navigation = useNavigation();
  const toast = useToast();
  const { createWallet } = useWallet();
  const [wallet, setWallet] = useState<Wallet>();
  const [hasSeenSeedPhrase, setHasSeenSeedPhrase] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { saveItem } = useSecureStorage();
  const dispatch = useDispatch();

  const copySeedPhrase = () => {
    if (isLoading) return;
    if (!wallet) {
      toast.show('Still generating wallet');
      return;
    }

    Clipboard.setString(wallet.mnemonic);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  const saveWallet = async () => {
    if (!wallet || !hasSeenSeedPhrase) {
      toast.show(
        "You haven't even seen your seed phrase. Do you want to lose your funds?🤨",
        {
          type: 'warning'
        }
      );
      return;
    }
    try {
      await saveItem('seedPhrase', wallet.mnemonic);

      const initWallet = {
        address: wallet.address,
        privateKey: wallet.privateKey
      };

      await saveItem('accounts', [initWallet]);

      dispatch(initAccounts([{ ...initWallet }]));
      dispatch(loginUser());
      //@ts-ignore
      navigation.navigate('Main');
    } catch (error) {
      return;
    }
  };

  const generateNewWallet = () => {
    try {
      const wallet = createWallet();
      setWallet(wallet);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    generateNewWallet();
  }, []);

  return (
    <View style={styles.container}>
      <BackButton />

      <ScrollView style={styles.contentContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Write Down Your Seed Phrase
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          This is your seed phrase. Write it down on a piece of paper and keep
          it in a safe place.
        </Text>

        <Divider style={{ marginVertical: 16 }} />

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <SeedPhrase
            seedPhrase={wallet?.mnemonic}
            onReveal={() => setHasSeenSeedPhrase(true)}
          />
        )}

        <Divider style={{ marginVertical: 16 }} />

        <Button
          mode="outlined"
          onPress={copySeedPhrase}
          style={styles.copyButton}
          labelStyle={styles.buttonText}
        >
          Copy To Clipboard
        </Button>
        <Button
          mode="contained"
          onPress={saveWallet}
          style={styles.nextButton}
          labelStyle={[styles.buttonText, { color: 'white' }]}
        >
          Next
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 15
  },
  contentContainer: { flex: 1, paddingHorizontal: 10, marginTop: 20 },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 1.5 * FONT_SIZE['xl'],
    lineHeight: 40,
    ...globalStyles.textSemiBold
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 8,
    ...globalStyles.text
  },
  loader: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center'
  },
  copyButton: {
    marginTop: 20,
    paddingVertical: 5,
    borderColor: COLORS.primary
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 5
  },
  buttonText: {
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  }
});
