import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, Switch, Button, Divider } from "react-native-paper";

import styles from "../../styles/authentication/createPassword";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PasswordInput from "../../components/forms/PasswordInput";
import { useToast } from "react-native-toast-notifications";

import { COLORS } from "../../utils/constants";
import ProgressIndicatorHeader from "../../components/headers/ProgressIndicatorHeader";
import { FONT_SIZE } from "../../utils/styles";
import { generate } from "random-words";
import ReactNativeBiometrics from "react-native-biometrics";
import { useSecureStorage } from "../../hooks/useSecureStorage";

type Props = {};

function CreatePassword({}: Props) {
  const navigation = useNavigation();
  const toast = useToast();
  const { saveItem } = useSecureStorage();

  const [suggestion, setSuggestion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);

  const createPassword = async () => {
    if (!password) {
      toast.show("Password cannot be empty!", {
        type: "danger",
      });
      return;
    }

    if (password.length < 8) {
      toast.show("Password must be at least 8 characters", {
        type: "danger",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.show("Passwords do not match!", {
        type: "danger",
      });
      return;
    }

    try {
      setIsCreating(true);

      const security = {
        password,
        isBiometricsEnabled,
      };

      await saveItem("security", security);

      // clean up
      setPassword("");
      setConfirmPassword("");
      setIsBiometricsEnabled(false);

      navigation.navigate("SecureWallet");
    } catch (error) {
      toast.show("Failed to create password. Please try again", {
        type: "danger",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // set suggested password
  useFocusEffect(
    useCallback(() => {
      setSuggestion(
        generate({ exactly: 2, join: "", minLength: 4, maxLength: 5 }),
      );
    }, []),
  );

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

      <ScrollView style={{ flex: 1 }}>
        <Text
          variant="headlineMedium"
          style={styles.title}
        >
          Create Password
        </Text>
        <Text
          variant="bodyLarge"
          style={styles.subtitle}
        >
          This password will unlock Scaffold-ETH only on this device
        </Text>

        <View style={styles.formContainer}>
          <PasswordInput
            label="New Password"
            value={password}
            suggestion={suggestion}
            infoText={password.length < 8 && "Must be at least 8 characters"}
            onChange={setPassword}
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            suggestion={suggestion}
            infoText={
              password &&
              confirmPassword &&
              password !== confirmPassword &&
              "Password must match"
            }
            onChange={setConfirmPassword}
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
          >
            Import
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

export default CreatePassword;
