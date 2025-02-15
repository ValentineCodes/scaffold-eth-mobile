import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useModal } from 'react-native-modalfy';
import {
  ActivityIndicator,
  Button,
  Divider,
  IconButton,
  Switch,
  Text
} from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { ethers } from '../../../patches/ethers';
import PasswordInput from '../../components/forms/PasswordInput';
import SeedPhraseInput from '../../components/forms/SeedPhraseInput';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import useWallet from '../../hooks/useWallet';
import { initAccounts } from '../../store/reducers/Accounts';
import { loginUser } from '../../store/reducers/Auth';
import styles from '../../styles/authentication/importWallet';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

function ImportWallet() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const { saveItem } = useSecureStorage();
  const { importWallet: importAccount } = useWallet();

  const { openModal } = useModal();

  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);

  function isValidMnemonic(seedPhrase: string) {
    return ethers.Mnemonic.isValidMnemonic(seedPhrase);
  }

  const renderSeedPhraseError = useCallback(() => {
    if (seedPhrase.trim().split(' ').length < 12) return;

    if (!isValidMnemonic(seedPhrase)) {
      return 'Invalid Seed Phrase';
    } else {
      return null;
    }
  }, [seedPhrase]);

  const isInputValid = (): boolean => {
    // input validation
    if (!isValidMnemonic(seedPhrase)) {
      toast.show('Invalid Seed Phrase', {
        type: 'danger'
      });
      return false;
    }
    if (!password) {
      toast.show('Password cannot be empty!', {
        type: 'danger'
      });
      return false;
    }

    if (password.length < 8) {
      toast.show('Password must be at least 8 characters', {
        type: 'danger'
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast.show('Passwords do not match!', {
        type: 'danger'
      });
      return false;
    }

    return true;
  };

  const importWallet = async () => {
    if (isImporting) return;
    if (!isInputValid()) return;

    setIsImporting(true);

    const wallet = await importAccount(seedPhrase, 1);

    console.log('wallet: ', wallet);
    const initWallet = [
      {
        address: wallet.address,
        privateKey: wallet.privateKey
      }
    ];

    try {
      await saveItem('seedPhrase', seedPhrase);
      await saveItem('accounts', initWallet);
      await saveItem('security', { password, isBiometricsEnabled });

      dispatch(initAccounts([{ ...initWallet[0], isImported: false }]));
      dispatch(loginUser());

      // @ts-ignore
      navigation.navigate('Main');
    } catch (error) {
      toast.show(
        'Failed to import wallet. Please ensure you have a stable network connection and try again',
        {
          type: 'danger'
        }
      );
    } finally {
      setIsImporting(false);
    }
  };

  const scanSeedPhrase = () => {
    openModal('QRCodeScanner', {
      onScan: setSeedPhrase
    });
  };

  useEffect(() => {
    (async () => {
      // check biometrics availability
      const rnBiometrics = new ReactNativeBiometrics();

      const { available } = await rnBiometrics.isSensorAvailable();

      if (available) {
        setIsBiometricsAvailable(available);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon={() => (
              <Ionicons
                name="arrow-back-outline"
                size={1.3 * FONT_SIZE['xl']}
                color="black"
              />
            )}
            onPress={() => navigation.goBack()}
          />
          <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
            Import From Seed
          </Text>
        </View>

        <IconButton
          icon={() => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={1.3 * FONT_SIZE['xl']}
              color="black"
            />
          )}
          onPress={scanSeedPhrase}
        />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          <SeedPhraseInput
            value={seedPhrase}
            onChange={setSeedPhrase}
            errorText={renderSeedPhraseError()}
          />
          <PasswordInput
            label="New Password"
            value={password}
            infoText={password.length < 8 && 'Must be at least 8 characters'}
            onChange={setPassword}
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            infoText={
              password &&
              confirmPassword &&
              password !== confirmPassword &&
              'Password must match'
            }
            onChange={setConfirmPassword}
          />

          {isBiometricsAvailable && (
            <>
              <Divider style={{ marginVertical: 16 }} />

              <View style={styles.biometricsContainer}>
                <Text variant="bodyLarge">Sign in with Biometrics</Text>
                <Switch
                  value={isBiometricsEnabled}
                  onValueChange={setIsBiometricsEnabled}
                  color={COLORS.primary}
                />
              </View>
            </>
          )}

          <Divider style={{ marginVertical: 16 }} />

          <Button mode="contained" onPress={importWallet}>
            {isImporting ? <ActivityIndicator color="white" /> : 'Import'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

export default ImportWallet;
