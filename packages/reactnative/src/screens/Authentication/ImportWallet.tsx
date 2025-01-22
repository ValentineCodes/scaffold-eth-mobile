import React, { useCallback, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";

import styles from "../../styles/authentication/importWallet";
import SeedPhraseInput from "../../components/forms/SeedPhraseInput";
import PasswordInput from "../../components/forms/PasswordInput";
import { Text, Button, Switch, Divider, IconButton } from "react-native-paper";
import { COLORS } from "../../utils/constants";
import QRCodeScanner from "../../components/modals/QRCodeScanner";
import { initAccounts } from "../../store/reducers/Accounts";
import { loginUser } from "../../store/reducers/Auth";
import { FONT_SIZE } from "../../utils/styles";
import { generate } from "random-words";
import AccountsCountModal from "../../components/modals/AccountsCountModal";
import ReactNativeBiometrics from "react-native-biometrics";
import { useSecureStorage } from "../../hooks/useSecureStorage";
import useWallet from "../../hooks/useWallet";

function ImportWallet() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const { saveItem } = useSecureStorage();
  const { importWallet: importAccount } = useWallet();

  const [seedPhrase, setSeedPhrase] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showAccountsCountModal, setShowAccountsCountModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);

  function isValidMnemonic(seedPhrase: string) {
    return true;
  }

  const renderSeedPhraseError = useCallback(() => {
    if (seedPhrase.trim().split(" ").length < 12) return;

    if (!isValidMnemonic(seedPhrase)) {
      return "Invalid Seed Phrase";
    } else {
      return null;
    }
  }, [seedPhrase]);

  const validateInput = () => {
    // input validation
    if (!isValidMnemonic(seedPhrase)) {
      toast.show("Invalid Seed Phrase", {
        type: "danger",
      });
      return;
    }
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

    setShowAccountsCountModal(true);
  };

  const importWallet = async (accountsCount: number) => {
    let wallets = [];

    setIsImporting(true);

    for (let i = 0; i < accountsCount; i++) {
      const wallet = await importAccount(seedPhrase, i);

      wallets.push({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    }

    try {
      await saveItem("seedPhrase", seedPhrase);
      await saveItem("accounts", wallets);
      await saveItem("security", { password, isBiometricsEnabled });

      dispatch(
        initAccounts(
          wallets.map((wallet) => ({ ...wallet, isImported: false })),
        ),
      );
      dispatch(loginUser());

      // @ts-ignore
      navigation.navigate("Main");
    } catch (error) {
      toast.show(
        "Failed to import wallet. Please ensure you have a stable network connection and try again",
        {
          type: "danger",
        },
      );
    } finally {
      setIsImporting(false);
    }
  };

  useEffect(() => {
    (async () => {
      // set suggested password
      setSuggestion(
        generate({ exactly: 2, join: "", minLength: 4, maxLength: 5 }),
      );

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
                size={1.3 * FONT_SIZE["xl"]} 
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
              size={1.3 * FONT_SIZE["xl"]} 
              color="black" 
            />
          )}
          onPress={() => setShowScanner(true)}
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

          <Button
            mode="contained"
            loading={isImporting}
            onPress={validateInput}
          >
            Import
          </Button>
        </View>

        {showAccountsCountModal && (
          <AccountsCountModal
            isVisible={showAccountsCountModal}
            onClose={() => setShowAccountsCountModal(false)}
            onFinish={(accountsCount: number) => {
              importWallet(accountsCount);
              setShowAccountsCountModal(false);
            }}
          />
        )}

        {showScanner && (
          <QRCodeScanner
            isOpen={showScanner}
            onClose={() => setShowScanner(false)}
            onReadCode={(data) => {
              setSeedPhrase(data);
              setShowScanner(false);
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default ImportWallet;
