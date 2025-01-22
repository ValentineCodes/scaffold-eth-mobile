import React, { useState } from "react";
import Modal from "react-native-modal";
import { View, StyleSheet } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { FONT_SIZE } from "../../../utils/styles";
import { parseFloat, truncateAddress } from "../../../utils/helperFunctions";
import { useSelector, useDispatch } from "react-redux";
import { Account } from "../../../store/reducers/Accounts";
import Blockie from "../../../components/Blockie";

import "react-native-get-random-values";
import "@ethersproject/shims";
import { Network } from "../../../store/reducers/Networks";

import "react-native-get-random-values";
import "@ethersproject/shims";
import { Wallet, ethers } from "ethers";

import CustomButton from "../../../components/Button";

import Success from "../../../components/modals/modules/Success";
import Fail from "../../../components/modals/modules/Fail";
import { Linking } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { addRecipient } from "../../../store/reducers/Recipients";
import { useSecureStorage } from "../../../hooks/useSecureStorage";
import { JsonRpcProvider, formatEther, parseEther } from "ethers";

interface TxData {
  from: Account;
  to: string;
  amount: number;
  fromBalance: bigint | null;
}
type Props = {
  isVisible: boolean;
  onClose: () => void;
  txData: TxData;
  estimateGasCost: bigint | null;
};

export default function ConfirmationModal({
  isVisible,
  onClose,
  txData,
  estimateGasCost,
}: Props) {
  const dispatch = useDispatch();

  const toast = useToast();

  const connectedNetwork: Network = useSelector((state: any) =>
    state.networks.find((network: Network) => network.isConnected),
  );

  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [txReceipt, setTxReceipt] =
    useState<ethers.TransactionReceipt | null>(null);

  const { getItem } = useSecureStorage();

  const formatBalance = () => {
    return txData.fromBalance && Number(formatEther(txData.fromBalance))
      ? parseFloat(Number(formatEther(txData.fromBalance)).toString(), 4)
      : 0;
  };

  const calcTotal = () => {
    return (
      estimateGasCost &&
      parseFloat(
        (txData.amount + Number(formatEther(estimateGasCost))).toString(),
        8,
      )
    );
  };

  const transfer = async () => {
    const accounts = await getItem("accounts");
    const activeAccount = Array.from(accounts).find(
      (account) =>
        account.address.toLowerCase() === txData.from.address.toLowerCase(),
    );

    const provider = new JsonRpcProvider(connectedNetwork.provider);
    const wallet = new Wallet(activeAccount.privateKey, provider);

    try {
      setIsTransferring(true);

      const tx = await wallet.sendTransaction({
        from: txData.from.address,
        to: txData.to,
        value: parseEther(txData.amount.toString()),
      });

      const txReceipt = await tx.wait(1);

      setTxReceipt(txReceipt);
      setShowSuccessModal(true);

      dispatch(addRecipient(txData.to));
    } catch (error) {
      setShowFailModal(true);
      return;
    } finally {
      setIsTransferring(false);
    }
  };

  const viewTxDetails = async () => {
    if (!connectedNetwork.blockExplorer || !txReceipt) return;

    try {
      await Linking.openURL(
        `${connectedNetwork.blockExplorer}/tx/${txReceipt.hash}`,
      );
    } catch (error) {
      toast.show("Cannot open url", {
        type: "danger",
      });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="zoomOut"
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            From:
          </Text>

          <View style={styles.accountContainer}>
            <View style={styles.accountInfo}>
              <Blockie
                address={txData.from.address}
                size={1.8 * FONT_SIZE["xl"]}
              />

              <View style={styles.accountDetails}>
                <Text variant="titleLarge" style={styles.accountName}>
                  {txData.from.name}
                </Text>
                <Text variant="bodyMedium">
                  Balance: {formatBalance()} {connectedNetwork.currencySymbol}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            To:
          </Text>

          <View style={styles.recipientContainer}>
            <Blockie address={txData.to} size={1.8 * FONT_SIZE["xl"]} />
            <Text variant="titleLarge" style={styles.accountName}>
              {truncateAddress(txData.to)}
            </Text>
          </View>
        </View>

        <Text variant="titleMedium" style={styles.amountLabel}>
          AMOUNT
        </Text>
        <Text variant="headlineLarge" style={styles.amount}>
          {txData.amount} {connectedNetwork.currencySymbol}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <View>
              <Text variant="titleMedium">Estimated gas fee</Text>
              <Text variant="bodySmall" style={styles.gasEstimate}>
                Likely in &lt; 30 second
              </Text>
            </View>
            <Text variant="titleMedium" style={styles.detailsValue}>
              {estimateGasCost &&
                parseFloat(ethers.formatEther(estimateGasCost), 8)}{" "}
              {connectedNetwork.currencySymbol}
            </Text>
          </View>

          <Divider />

          <View style={styles.detailsRow}>
            <Text variant="titleMedium">Total</Text>
            <Text variant="titleMedium" style={styles.detailsValue}>
              {calcTotal()} {connectedNetwork.currencySymbol}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            buttonColor="#ffebee"
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Button>
          <CustomButton
            text="Confirm"
            loading={isTransferring}
            onPress={transfer}
            style={styles.confirmButton}
          />
        </View>
      </View>

      <Success
        isVisible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        onViewDetails={viewTxDetails}
      />

      <Fail
        isVisible={showFailModal}
        onClose={() => setShowFailModal(false)}
        onRetry={() => {
          setShowFailModal(false);
          transfer();
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    gap: 16
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    fontWeight: '500'
  },
  accountContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 8
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  accountDetails: {
    width: '75%'
  },
  accountName: {
    fontWeight: '500'
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 8
  },
  amountLabel: {
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: -16
  },
  amount: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  detailsContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10
  },
  detailsRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  gasEstimate: {
    color: '#27B858'
  },
  detailsValue: {
    width: '50%',
    textAlign: 'right'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cancelButton: {
    width: '50%',
    borderRadius: 0
  },
  cancelButtonText: {
    color: '#ef5350'
  },
  confirmButton: {
    width: '50%',
    borderRadius: 0
  }
});
