import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Button, Divider, Switch, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import PasswordInput from '../../components/forms/PasswordInput';
import ProgressIndicatorHeader from '../../components/headers/ProgressIndicatorHeader';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import styles from '../../styles/authentication/createPassword';
import { COLORS } from '../../utils/constants';

type Props = {};

function CreatePassword({}: Props) {
  const navigation = useNavigation();
  const toast = useToast();
  const { saveItem } = useSecureStorage();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);

  const createPassword = async () => {
    if (!password) {
      toast.show('Password cannot be empty!', {
        type: 'danger'
      });
      return;
    }

    if (password.length < 8) {
      toast.show('Password must be at least 8 characters', {
        type: 'danger'
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.show('Passwords do not match!', {
        type: 'danger'
      });
      return;
    }

    try {
      setIsCreating(true);

      const security = {
        password,
        isBiometricsEnabled
      };

      await saveItem('security', security);

      // clean up
      setPassword('');
      setConfirmPassword('');
      setIsBiometricsEnabled(false);

      navigation.navigate('CreateWallet');
    } catch (error) {
      toast.show('Failed to create password. Please try again', {
        type: 'danger'
      });
    } finally {
      setIsCreating(false);
    }
  };

  // check biometrics availability
  useEffect(() => {
    (async () => {
      const rnBiometrics = new ReactNativeBiometrics();

      const { available } = await rnBiometrics.isSensorAvailable();

      if (available) {
        setIsBiometricsAvailable(available);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ProgressIndicatorHeader progress={1} />

      <Divider style={{ marginVertical: 32 }} />

      <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Password
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          This password will unlock Scaffold-ETH only on this device
        </Text>

        <View style={styles.formContainer}>
          <PasswordInput
            label="New Password"
            value={password}
            infoText={password.length < 8 && 'Must be at least 8 characters'}
            onChange={setPassword}
            onSubmit={createPassword}
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
            onSubmit={createPassword}
          />

          {isBiometricsAvailable && (
            <>
              <Divider style={{ marginVertical: 16 }} />

              <View style={styles.biometricsContainer}>
                <Text variant="titleLarge">Sign in with Biometrics</Text>
                <Switch
                  value={isBiometricsEnabled}
                  onValueChange={setIsBiometricsEnabled}
                  color={COLORS.primary}
                />
              </View>
            </>
          )}

          <Divider style={{ marginVertical: 16 }} />

          <Button
            mode="contained"
            loading={isCreating}
            onPress={createPassword}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Import
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

export default CreatePassword;
