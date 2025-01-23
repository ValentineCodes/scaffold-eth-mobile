import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { Modal, Portal, Text, IconButton, Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  Account,
  addAccount,
  switchAccount,
} from "../../store/reducers/Accounts";
import Button from "../Button";
import Blockie from "../Blockie";
import { COLORS } from "../../utils/constants";
import { FONT_SIZE } from "../../utils/styles";
import ImportAccountModal from "./ImportAccountModal";
import { useToast } from "react-native-toast-notifications";
import { useSecureStorage } from "../../hooks/useSecureStorage";
import useWallet from "../../hooks/useWallet";
import { truncateAddress } from "../../utils/helperFunctions";

type Props = {
  isVisible: boolean;
  setVisibility: (isVisible: boolean) => void;
  onClose: () => void;
};

export default function AccountsModal({
  isVisible,
  setVisibility,
  onClose,
}: Props) {
  const dispatch = useDispatch();
  const toast = useToast();
  const { importWallet } = useWallet();
  const { getItem, saveItem } = useSecureStorage();

  const accounts: Account[] = useSelector((state) => state.accounts);
  const connectedAccount: Account = useSelector((state) =>
    state.accounts.find((account: Account) => account.isConnected),
  );

  const [showImportAccountModal, setShowImportAccountModal] = useState(false);

  const handleAccountSelection = (account: string) => {
    if (account !== connectedAccount.address) {
      dispatch(switchAccount(account));
      setVisibility(false);
    }
  };

  const createAccount = async () => {
    const mnemonic = (await getItem("mnemonic")) as string;
    let newAccount;

    for (let i = 0; i < Infinity; i++) {
      const wallet = await importWallet(mnemonic, i);
      if (!accounts.find((account) => account.address == wallet.address)) {
        newAccount = {
          address: wallet.address,
          privateKey: wallet.privateKey,
        };
        break;
      }
    }

    if (!newAccount) {
      toast.show("Failed to create account!", { type: "danger" });
      return;
    }

    const createdAccounts = await getItem("accounts");
    await saveItem(
      "accounts",
      JSON.stringify([
        ...createdAccounts,
        { privateKey: newAccount.privateKey, address: newAccount.address },
      ]),
    );

    dispatch(addAccount({ address: newAccount.address, isImported: false }));
    dispatch(switchAccount(newAccount.address));
    setVisibility(false);
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">Accounts</Text>
          <IconButton icon="close" onPress={onClose} />
        </View>

        <Divider />

        <ScrollView style={styles.scrollView}>
          {accounts.map((account, index) => (
            <View 
              key={account.address}
              style={[
                styles.accountItem,
                index !== accounts.length - 1 && styles.accountDivider
              ]}
            >
              <View style={styles.accountInfo}>
                <Blockie
                  address={account.address}
                  size={1.7 * FONT_SIZE.xl}
                />
                <View style={styles.accountDetails}>
                  <Text variant="titleMedium">{account.name}</Text>
                  <Text variant="bodyMedium">{truncateAddress(account.address)}</Text>
                </View>
              </View>
              {account.isConnected && (
                <IconButton 
                  icon="check-circle" 
                  iconColor={COLORS.primary}
                  size={24}
                />
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            text="Create"
            onPress={createAccount}
            style={styles.button}
          />
          <Button
            type="outline"
            text="Import"
            onPress={() => setShowImportAccountModal(true)}
            style={styles.button}
          />
        </View>

        <ImportAccountModal
          isVisible={showImportAccountModal}
          onClose={() => setShowImportAccountModal(false)}
          onImport={() => {
            setShowImportAccountModal(false);
            onClose();
          }}
        />
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: Dimensions.get("window").height / 4.8,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  accountDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  accountDetails: {
    gap: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 16,
  },
  button: {
    flex: 1,
  },
});
