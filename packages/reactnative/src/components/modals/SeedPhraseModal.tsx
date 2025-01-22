import {
  View,
  StyleSheet,
  Pressable
} from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
// @ts-ignore
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import { FONT_SIZE } from "../../utils/styles";
import { COLORS } from "../../utils/constants";
import { useSecureStorage } from "../../hooks/useSecureStorage";
import Button from "../Button";
import Clipboard from "@react-native-clipboard/clipboard";
import { useToast } from "react-native-toast-notifications";
import { Text, TextInput, IconButton, Portal, Surface } from "react-native-paper";

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function SeedPhraseModal({ isVisible, onClose }: Props) {
  const toast = useToast();
  const { getItem } = useSecureStorage();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");

  const showSeedPhrase = async () => {
    if (!password) {
      setError("Password cannot be empty");
      return;
    }

    // verify password
    const security = await getItem("security");

    if (password !== security.password) {
      setError("Incorrect password!");
      return;
    }

    // retrieve seed phrase
    const seedPhrase = await getItem("seedPhrase");
    if (seedPhrase) {
      setSeedPhrase(seedPhrase);
    }
  };

  const handleInputChange = (value: string) => {
    setPassword(value);
    if (error) {
      setError("");
    }
  };

  const copySeedPhrase = () => {
    Clipboard.setString(seedPhrase);
    toast.show("Copied to clipboard", {
      type: "success",
    });
  };

  const handleOnClose = () => {
    onClose();
    setSeedPhrase("");
    setPassword("");
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInRight"
      animationOut="slideOutLeft"
      onBackButtonPress={handleOnClose}
      onBackdropPress={handleOnClose}
    >
      <Surface style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium">Show seed phrase</Text>
          <IconButton
            icon="close"
            size={24}
            onPress={handleOnClose}
          />
        </View>

        {seedPhrase ? (
          <Surface style={styles.seedPhraseContainer}>
            <Text style={styles.seedPhraseText}>{seedPhrase}</Text>
            <IconButton
              icon="content-copy"
              size={20}
              onPress={copySeedPhrase}
              iconColor={COLORS.primary}
            />
          </Surface>
        ) : (
          <View style={styles.passwordContainer}>
            <Text variant="titleLarge">Enter your password</Text>
            <TextInput
              value={password}
              mode="outlined"
              secureTextEntry
              placeholder="Password"
              onChangeText={handleInputChange}
              onSubmitEditing={showSeedPhrase}
              style={styles.input}
              activeOutlineColor={COLORS.primary}
            />
            {error && (
              <Text style={styles.errorText} variant="bodySmall">{error}</Text>
            )}
          </View>
        )}

        <Surface style={styles.warningContainer}>
          <IconButton
            icon="eye-off"
            size={24}
            iconColor="#ef4444"
            style={styles.warningIcon}
          />
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
            <Pressable
              style={styles.cancelButton}
              onPress={handleOnClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Button
              text="Reveal"
              onPress={showSeedPhrase}
              style={styles.revealButton}
            />
          </View>
        )}
      </Surface>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 30,
    elevation: 4
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  seedPhraseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16
  },
  seedPhraseText: {
    flex: 1,
    marginRight: 8,
    fontSize: FONT_SIZE.lg
  },
  passwordContainer: {
    marginBottom: 16
  },
  input: {
    marginTop: 8,
    marginBottom: 4
  },
  errorText: {
    color: '#ef4444'
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#fee2e2',
    marginBottom: 16
  },
  warningIcon: {
    margin: 0
  },
  warningText: {
    flex: 1,
    marginLeft: 16,
    fontSize: FONT_SIZE.md
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cancelButton: {
    width: '50%',
    padding: 16,
    backgroundColor: '#fee2e2'
  },
  cancelButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: FONT_SIZE.md
  },
  revealButton: {
    width: '50%',
    borderRadius: 0
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 15,
  },
  addressText: {
    fontWeight: "700",
    fontSize: FONT_SIZE["md"],
    color: COLORS.primary,
  },
});
