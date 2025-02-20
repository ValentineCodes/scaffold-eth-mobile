import { ethers } from 'ethers';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { IconButton, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import {
  Account,
  addAccount,
  switchAccount
} from '../../store/reducers/Accounts';
import globalStyles from '../../styles/globalStyles';
import { Wallet } from '../../types/wallet';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Button from '../Button';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function ImportAccountModal({ modal: { closeModal } }: Props) {
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');

  const { saveItem, getItem } = useSecureStorage();
  const dispatch = useDispatch();
  const accounts: Account[] = useSelector((state: any) => state.accounts);
  const { openModal } = useModal();

  const importWallet = async () => {
    try {
      const wallet = new ethers.Wallet(privateKey);

      if (accounts.find(account => account.address == wallet.address)) {
        setError('Account already exists');
        return;
      }

      const createdAccounts = (await getItem('accounts')) as Wallet[];
      await saveItem(
        'accounts',
        JSON.stringify([
          ...createdAccounts,
          { privateKey: privateKey, address: wallet.address }
        ])
      );

      dispatch(addAccount({ address: wallet.address }));
      dispatch(switchAccount(wallet.address));

      closeModal();
    } catch (error) {
      setError('Invalid private key');
    }
  };

  const handleInputChange = (value: string) => {
    setPrivateKey(value);
    if (error) {
      setError('');
    }
  };

  const scanPk = () => {
    openModal('QRCodeScanner', {
      onScan: setPrivateKey
    });
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="cloud-download"
        size={4 * FONT_SIZE.xl}
        iconColor={COLORS.primary}
      />
      <Text variant="headlineMedium" style={styles.title}>
        Import Account
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Imported accounts won't be associated with your Paux Secret Recovery
        Phrase.
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={privateKey}
          onChangeText={handleInputChange}
          mode="outlined"
          secureTextEntry
          placeholder="Enter your private key here"
          right={
            <TextInput.Icon
              icon="qrcode-scan"
              onPress={scanPk}
              forceTextInputFocus={false}
            />
          }
          error={!!error}
          outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
          contentStyle={globalStyles.text}
        />
        {error && (
          <Text variant="bodySmall" style={styles.errorText}>
            {error}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          type="outline"
          text="Cancel"
          onPress={closeModal}
          style={styles.button}
        />
        <Button text="Import" onPress={importWallet} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    gap: 16,
    width: WINDOW_WIDTH * 0.9
  },
  title: {
    color: COLORS.primary,
    ...globalStyles.textSemiBold
  },
  subtitle: {
    textAlign: 'center',
    fontSize: FONT_SIZE['md'],
    ...globalStyles.text
  },
  inputContainer: {
    width: '100%',
    gap: 4
  },
  errorText: {
    color: COLORS.error,
    ...globalStyles.text
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%'
  },
  button: {
    flex: 1
  }
});
