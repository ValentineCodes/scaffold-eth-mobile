import { useIsFocused } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useModal } from 'react-native-modalfy';
import { Switch, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import useNetwork from '../../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../../hooks/useSecureStorage';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {};

export default function Settings({}: Props) {
  const toast = useToast();
  const { openModal } = useModal();
  const isFocused = useIsFocused();
  const { getItem, saveItem } = useSecureStorage();

  const network = useNetwork();

  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  const toggleBiometrics = async (isBiometricsEnabled: boolean) => {
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      const signInWithBio = async () => {
        let epochTimeSeconds = Math.round(
          new Date().getTime() / 1000
        ).toString();
        let payload = epochTimeSeconds + 'some message';

        try {
          const response = await rnBiometrics.createSignature({
            promptMessage: 'Authenticate',
            payload: payload
          });

          if (response.success) {
            const security = await getItem('security');
            await saveItem('security', { ...security, isBiometricsEnabled });
            setIsBiometricsEnabled(isBiometricsEnabled);
          }
        } catch (error) {
          return;
        }
      };

      const { available } = await rnBiometrics.isSensorAvailable();

      if (available) {
        const { keysExist } = await rnBiometrics.biometricKeysExist();

        if (!keysExist) {
          await rnBiometrics.createKeys();
        }

        signInWithBio();
      } else {
        toast.show('Biometrics is not available on this device');
      }
    } catch (error) {
      toast.show('Could not sign in with biometrics', {
        type: 'danger'
      });
    }
  };

  const switchNetwork = () => {
    openModal('SwitchNetworkModal');
  };

  useLayoutEffect(() => {
    (async () => {
      const rnBiometrics = new ReactNativeBiometrics();

      const { available } = await rnBiometrics.isSensorAvailable();

      setIsBiometricsAvailable(available);

      if (available) {
        const security = await getItem('security');
        setIsBiometricsEnabled(security.isBiometricsEnabled);
      }
    })();
  }, []);

  if (!isFocused) return;
  return (
    <View style={styles.container}>
      {isBiometricsAvailable && (
        <View style={styles.row}>
          <Text variant="titleLarge">Sign in with Biometrics</Text>
          <Switch
            value={isBiometricsEnabled}
            onValueChange={toggleBiometrics}
            color={COLORS.primary}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={() => openModal('ChangePasswordModal')}
        style={styles.button}
      >
        <Text variant="titleLarge">Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={switchNetwork} style={styles.button}>
        <Text variant="titleLarge">Change Network({network.name})</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    paddingVertical: 16
  },
  network: {
    fontSize: FONT_SIZE['lg'],
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10
  }
});
