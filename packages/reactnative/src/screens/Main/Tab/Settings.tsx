import { View, StyleSheet } from "react-native";
import { Text, Switch } from "react-native-paper";
import React, { useLayoutEffect, useState } from "react";
import { FONT_SIZE } from "../../../utils/styles";
import { COLORS } from "../../../utils/constants";
import ReactNativeBiometrics from "react-native-biometrics";
import { useToast } from "react-native-toast-notifications";
import { useModal } from "react-native-modalfy";
import { useIsFocused } from "@react-navigation/native";
import { useSecureStorage } from "../../../hooks/useSecureStorage";
import { TouchableOpacity } from "react-native";

type Props = {};

export default function Settings({}: Props) {
  const toast = useToast();
  const { openModal } = useModal();
  const isFocused = useIsFocused();
  const { getItem, saveItem } = useSecureStorage();

  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  const toggleBiometrics = async (isBiometricsEnabled: boolean) => {
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      const signInWithBio = async () => {
        let epochTimeSeconds = Math.round(
          new Date().getTime() / 1000,
        ).toString();
        let payload = epochTimeSeconds + "some message";

        try {
          const response = await rnBiometrics.createSignature({
            promptMessage: "Authenticate",
            payload: payload,
          });

          if (response.success) {
            const security = await getItem("security");
            await saveItem("security", { ...security, isBiometricsEnabled });
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
        toast.show("Biometrics is not available on this device");
      }
    } catch (error) {
      toast.show("Could not sign in with biometrics", {
        type: "danger",
      });
    }
  };

  useLayoutEffect(() => {
    (async () => {
      const rnBiometrics = new ReactNativeBiometrics();

      const { available } = await rnBiometrics.isSensorAvailable();

      setIsBiometricsAvailable(available);

      if (available) {
        const security = await getItem("security");
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
        onPress={() => openModal("ChangePasswordModal")}
        style={styles.button}
      >
        <Text variant="titleLarge">Change Password</Text>
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
  }
});
