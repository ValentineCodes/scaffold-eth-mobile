import { useIsFocused } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useModal } from 'react-native-modalfy';
import { Divider, Switch, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useNetwork, useSecureStorage } from '../../../hooks/scaffold-eth';
import globalStyles from '../../../styles/globalStyles';
import { Security } from '../../../types/security';
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
            const security = (await getItem('security')) as Security;
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
        const security = (await getItem('security')) as Security;
        setIsBiometricsEnabled(security.isBiometricsEnabled);
      }
    })();
  }, []);

  if (!isFocused) return;
  return (
    <View style={styles.container}>
      <Text
        style={{ fontSize: FONT_SIZE['xl'] * 1.2, ...globalStyles.textMedium }}
      >
        Settings
      </Text>

      <Divider style={styles.divider} />

      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        {isBiometricsAvailable && (
          <View style={styles.settingWrapper}>
            <Ionicons
              name="finger-print-outline"
              size={FONT_SIZE['xl'] * 1.2}
            />
            <View style={styles.row}>
              <Text style={styles.settingTitle}>Sign in with Biometrics</Text>
              <Switch
                value={isBiometricsEnabled}
                onValueChange={toggleBiometrics}
                color={COLORS.primary}
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => openModal('ChangePasswordModal')}
          style={styles.settingWrapper}
        >
          <Ionicons name="lock-closed-outline" size={FONT_SIZE['xl'] * 1.2} />
          <Text style={styles.settingTitle}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchNetwork} style={styles.settingWrapper}>
          <Ionicons name="git-network-outline" size={FONT_SIZE['xl'] * 1.2} />
          <Text style={styles.settingTitle}>
            Change Network<Text style={styles.network}>({network.name})</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16
  },
  divider: {
    backgroundColor: '#bcbcbc',
    marginVertical: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
  settingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
    paddingVertical: 16
  },
  settingTitle: {
    fontSize: FONT_SIZE['xl'],
    ...globalStyles.text
  },
  network: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.text,
    color: COLORS.primary
  }
});
