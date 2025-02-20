import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, TextInput } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import globalStyles from '../../styles/globalStyles';
import { Security } from '../../types/security';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Button from '../buttons/CustomButton';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function SeedPhraseModal({ modal: { closeModal } }: Props) {
  const toast = useToast();
  const { getItem } = useSecureStorage();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');

  const showSeedPhrase = async () => {
    if (!password) {
      setError('Password cannot be empty');
      return;
    }

    // verify password
    const security = (await getItem('security')) as Security;

    if (password !== security.password) {
      setError('Incorrect password!');
      return;
    }

    // retrieve seed phrase
    const seedPhrase = (await getItem('seedPhrase')) as string;
    if (seedPhrase) {
      setSeedPhrase(seedPhrase);
    }
  };

  const handleInputChange = (value: string) => {
    setPassword(value);
    if (error) {
      setError('');
    }
  };

  const copySeedPhrase = () => {
    Clipboard.setString(seedPhrase);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  const handleOnClose = () => {
    closeModal();
    setSeedPhrase('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Show seed phrase
        </Text>
        <Ionicons
          name="close-outline"
          size={FONT_SIZE['xl'] * 1.7}
          onPress={handleOnClose}
        />
      </View>

      {seedPhrase ? (
        <Surface style={styles.seedPhraseContainer}>
          <Text style={styles.seedPhraseText}>{seedPhrase}</Text>
          <Ionicons
            name="copy-outline"
            size={FONT_SIZE['xl']}
            onPress={copySeedPhrase}
            color={COLORS.primary}
          />
        </Surface>
      ) : (
        <View style={styles.passwordContainer}>
          <Text variant="titleMedium" style={globalStyles.textMedium}>
            Enter your password
          </Text>
          <TextInput
            value={password}
            mode="outlined"
            secureTextEntry
            placeholder="Password"
            onChangeText={handleInputChange}
            onSubmitEditing={showSeedPhrase}
            style={styles.input}
            activeOutlineColor={COLORS.primary}
            outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
            contentStyle={globalStyles.text}
          />
          {error && (
            <Text style={styles.errorText} variant="bodySmall">
              {error}
            </Text>
          )}
        </View>
      )}

      <Surface style={styles.warningContainer}>
        <Ionicons name="eye-off" size={24} color={COLORS.error} />
        <Text style={styles.warningText}>
          Never disclose this seed phrase. Anyone with your seed phrase can
          fully control all your accounts created with this seed phrase,
          including transferring away any of your funds.
        </Text>
      </Surface>

      {seedPhrase ? (
        <Button text="Done" onPress={handleOnClose} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            type="outline"
            text="Cancel"
            onPress={handleOnClose}
            style={styles.cancelButton}
          />
          <Button
            text="Reveal"
            onPress={showSeedPhrase}
            style={styles.revealButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 20,
    width: WINDOW_WIDTH * 0.9
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  headerTitle: {
    fontSize: FONT_SIZE['xl'],
    ...globalStyles.textMedium
  },
  seedPhraseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'white'
  },
  seedPhraseText: {
    flex: 1,
    marginRight: 10,
    ...globalStyles.text,
    fontSize: FONT_SIZE['lg']
  },
  passwordContainer: {
    marginBottom: 16
  },
  input: {
    marginTop: 8,
    marginBottom: 4
  },
  errorText: {
    color: '#ef4444',
    ...globalStyles.text
  },
  warningContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
    backgroundColor: COLORS.lightRed,
    marginBottom: 20
  },
  warningIcon: {
    margin: 0
  },
  warningText: {
    flex: 1,
    marginLeft: 16,
    ...globalStyles.text
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16
  },
  cancelButton: {
    flex: 1
  },
  revealButton: {
    flex: 1
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 15
  },
  addressText: {
    fontWeight: '700',
    fontSize: FONT_SIZE['md'],
    color: COLORS.primary
  }
});
