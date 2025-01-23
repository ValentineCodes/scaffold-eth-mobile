import Clipboard from '@react-native-clipboard/clipboard';
import { BlurView } from '@react-native-community/blur';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, Text } from 'react-native-paper';
import ProgressIndicatorHeader from '../../components/headers/ProgressIndicatorHeader';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import useWallet from '../../hooks/useWallet';

interface Wallet {
  mnemonic: string;
  privateKey: string;
  address: string;
}

type Props = {};

export default function GenerateSeedPhrase({}: Props) {
  const navigation = useNavigation();
  const toast = useToast();
  const { createWallet } = useWallet();
  const [wallet, setWallet] = useState<Wallet>();
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { saveItem } = useSecureStorage();

  const copySeedPhrase = () => {
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
    if (!wallet || !showSeedPhrase) {
      toast.show('Reveal your seed phrase before proceeding to the next step', {
        type: 'warning'
      });
      return;
    }
    try {
      await saveItem('seedPhrase', wallet.mnemonic);
      navigation.navigate('ConfirmSeedPhrase');
    } catch (error) {
      return;
    }
  };

  const generateNewWallet = () => {
    setTimeout(async () => {
      const wallet = await createWallet();
      setWallet(wallet);
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    generateNewWallet();
  }, []);

  return (
    <View style={styles.container}>
      <ProgressIndicatorHeader progress={2} />

      <Divider style={{ marginTop: 32, marginBottom: 16 }} />

      <ScrollView style={{ flex: 1 }}>
        <Text variant="headlineMedium" style={styles.title}>
          Write Down Your Seed Phrase
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          This is your seed phrase. Write it down on a piece of paper and keep
          it in a safe place. You'll be asked to re-enter this phrase (in order)
          on the next step.
        </Text>

        <Divider style={{ marginVertical: 16 }} />

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <View style={styles.seedPhraseContainer}>
            <View style={styles.seedPhraseWrapper}>
              {wallet?.mnemonic.split(' ').map((word, index) => (
                <Text key={word} style={styles.word}>
                  {index + 1}. {word}
                </Text>
              ))}
            </View>

            {!showSeedPhrase && (
              <>
                <BlurView
                  style={styles.blurView}
                  blurType="light"
                  blurAmount={6}
                  reducedTransparencyFallbackColor="white"
                />
                <View style={styles.seedPhraseMask}>
                  <Text
                    variant="titleLarge"
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                  >
                    Tap to reveal your seed phrase
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ textAlign: 'center', marginTop: 8 }}
                  >
                    Make sure no one is watching your screen
                  </Text>
                  <Button
                    mode="contained"
                    icon="eye"
                    onPress={() => setShowSeedPhrase(true)}
                    style={styles.viewButton}
                  >
                    View
                  </Button>
                </View>
              </>
            )}
          </View>
        )}

        <Divider style={{ marginVertical: 16 }} />

        <Button
          mode="outlined"
          onPress={copySeedPhrase}
          disabled={isLoading}
          style={styles.copyButton}
        >
          Copy To Clipboard
        </Button>
        <Button
          mode="contained"
          onPress={saveWallet}
          disabled={isLoading}
          style={styles.nextButton}
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
    padding: 15
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 1.7 * FONT_SIZE['xl'],
    fontWeight: 'bold',
    lineHeight: 40
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 8
  },
  loader: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center'
  },
  seedPhraseContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 40,
    padding: 15
  },
  seedPhraseWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  word: {
    width: '45%',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10
  },
  blurView: {
    position: 'absolute',
    top: -20,
    left: -20,
    bottom: -20,
    right: -20
  },
  seedPhraseMask: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  viewButton: {
    marginTop: 8,
    borderRadius: 25,
    backgroundColor: '#2AB858'
  },
  copyButton: {
    marginBottom: 20
  },
  nextButton: {
    marginBottom: 50
  }
});
