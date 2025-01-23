import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Modal, Portal, Text, IconButton, Button as PaperButton } from "react-native-paper";
import { COLORS } from "../../utils/constants";
import { FONT_SIZE, WINDOW_HEIGHT } from "../../utils/styles";
import useNetwork from "../../hooks/scaffold-eth/useNetwork";
import useAccount from "../../hooks/scaffold-eth/useAccount";
import Blockie from "../Blockie";
import Button from "../Button";
import useBalance from "../../hooks/scaffold-eth/useBalance";

type Props = {
  modal: {
    closeModal: (modal?: string, callback?: () => void) => void;
    params: {
      message: any;
      onReject: () => void;
      onConfirm: () => void;
    };
  };
};

export default function SignMessageModal({
  modal: { closeModal, params },
}: Props) {
  const account = useAccount();
  const network = useNetwork();
  const { balance } = useBalance({ address: account.address });

  const sign = () => {
    closeModal("SignMessageModal", params.onConfirm);
  };

  const reject = () => {
    closeModal();
    params.onReject();
  };

  return (
    <Portal>
      <Modal visible={true} onDismiss={closeModal} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.accountInfo}>
            <Blockie address={account.address} size={1.8 * FONT_SIZE.xl} />
            <View>
              <Text variant="bodyMedium">{network.name} network</Text>
              <Text variant="bodyMedium" style={styles.accountName}>
                {account.name}
              </Text>
            </View>
          </View>

          <View style={styles.balanceInfo}>
            <Text variant="bodyMedium">Balance</Text>
            <Text variant="bodyMedium" style={styles.balance}>
              {balance && `${balance} ${network.currencySymbol}`}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.titleContainer}>
            <Text variant="headlineMedium" style={styles.title}>
              Signature Request
            </Text>

            <Text variant="bodyMedium" style={styles.subtitle}>
              Only sign this message if you fully understand the content and trust
              this platform
            </Text>

            <Text variant="bodyMedium" style={styles.label}>
              You are signing:
            </Text>
          </View>

          <View style={styles.messageContainer}>
            <Text variant="titleLarge" style={styles.messageLabel}>
              Message:
            </Text>
            <Text variant="bodySmall" style={styles.message}>
              {JSON.stringify(params.message)}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <PaperButton
            mode="contained"
            onPress={reject}
            buttonColor="#FFCDD2"
            style={styles.rejectButton}
          >
            Reject
          </PaperButton>
          <Button
            text="Sign"
            onPress={sign}
            style={styles.signButton}
          />
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    margin: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accountName: {
    fontWeight: "500",
  },
  balanceInfo: {
    alignItems: "flex-end",
  },
  balance: {
    fontWeight: "500",
  },
  content: {
    maxHeight: WINDOW_HEIGHT * 0.5,
  },
  titleContainer: {
    alignItems: "center",
    padding: 8,
    gap: 16,
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
  },
  label: {
    color: "gray",
  },
  messageContainer: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  messageLabel: {
    color: "gray",
  },
  message: {
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rejectButton: {
    width: "50%",
  },
  signButton: {
    width: "50%",
    borderRadius: 0,
  },
});
