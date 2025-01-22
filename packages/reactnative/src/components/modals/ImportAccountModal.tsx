import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, Text, TextInput, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../utils/constants";
import { FONT_SIZE } from "../../utils/styles";
import Button from "../Button";
import QRCodeScanner from "./QRCodeScanner";
import { ethers } from "ethers";
import { Account, addAccount, switchAccount } from "../../store/reducers/Accounts";
import { useSecureStorage } from "../../hooks/useSecureStorage";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onImport: () => void;
};

export default function ImportAccountModal({
  isVisible,
  onClose,
  onImport,
}: Props) {
  const [privateKey, setPrivateKey] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState("");

  const { saveItem, getItem } = useSecureStorage();
  const dispatch = useDispatch();
  const accounts: Account[] = useSelector((state) => state.accounts);

  const importWallet = async () => {
    try {
      const wallet = new ethers.Wallet(privateKey);

      if (accounts.find((account) => account.address == wallet.address)) {
        setError("Account already exists");
        return;
      }

      const createdAccounts = await getItem("accounts");
      await saveItem(
        "accounts",
        JSON.stringify([
          ...createdAccounts,
          { privateKey: privateKey, address: wallet.address },
        ]),
      );

      dispatch(addAccount({ address: wallet.address, isImported: true }));
      dispatch(switchAccount(wallet.address));

      onImport();
    } catch (error) {
      setError("Invalid private key");
    }
  };

  const handleInputChange = (value: string) => {
    setPrivateKey(value);
    if (error) {
      setError("");
    }
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
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
                  onPress={() => setShowScanner(true)}
                  forceTextInputFocus={false}
                />
              }
              error={!!error}
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
              onPress={onClose}
              style={styles.button}
            />
            <Button
              text="Import"
              onPress={importWallet}
              style={styles.button}
            />
          </View>
        </View>

        {showScanner && (
          <QRCodeScanner
            isOpen={showScanner}
            onClose={() => setShowScanner(false)}
            onReadCode={(privateKey) => {
              setPrivateKey(privateKey);
              setShowScanner(false);
            }}
          />
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 28,
    margin: 20,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    gap: 4,
  },
  errorText: {
    color: COLORS.error,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  button: {
    flex: 1,
  },
});
