import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton, Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import { Account } from "../../store/reducers/Accounts";
import { Network } from "../../store/reducers/Networks";

import { ethers } from "ethers";
import { Linking } from "react-native";
import { useToast } from "react-native-toast-notifications";
import Modal from "react-native-modal";
// @ts-ignore
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import { FONT_SIZE } from "../../utils/styles";
import { parseFloat, truncateAddress } from "../../utils/helperFunctions";
import { COLORS } from "../../utils/constants";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  tx: any;
};

export default function TransactionDetails({ isVisible, onClose, tx }: Props) {
  const connectedAccount: Account = useSelector((state) =>
    state.accounts.find((account: Account) => account.isConnected),
  );
  const connectedNetwork: Network = useSelector((state: any) =>
    state.networks.find((network: Network) => network.isConnected),
  );

  const toast = useToast();

  const renderAction = () => {
    if (tx.functionName === "") {
      if (tx.from.toLowerCase() == connectedAccount.address.toLowerCase()) {
        return `Transfer `;
      }
      if (tx.to.toLowerCase() == connectedAccount.address.toLowerCase()) {
        return `Receive`;
      }
    }

    return "Contract Interaction";
  };

  const renderTimestamp = () => {
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const d = new Date(Number(tx.timeStamp) * 1000);

    let hour = d.getHours();
    let minutes = d.getMinutes();
    let day = d.getDate();
    let monthIndex = d.getMonth();
    let year = d.getFullYear();

    const currentYear = new Date().getFullYear();

    return `${MONTHS[monthIndex]} ${day}${year !== currentYear ? `, ${year}` : ""} at ${hour}:${minutes}${hour >= 0 && hour < 12 ? " am" : " pm"}`;
  };

  const calcGasFee = () => {
    const estimatedGasFee = ethers.getBigInt(tx.gasUsed) * ethers.getBigInt(tx.gasPrice);
    return parseFloat(
      ethers.formatEther(estimatedGasFee).toString(),
      5,
    );
  };

  const calcTotalAmount = () => {
    const estimatedGasFee = ethers.getBigInt(tx.gasUsed) * ethers.getBigInt(tx.gasPrice);
    const totalAmount = estimatedGasFee + ethers.getBigInt(tx.value);

    return parseFloat(
      ethers.formatEther(totalAmount).toString(),
      5,
    );
  };

  const viewOnBlockExplorer = async () => {
    if (!connectedNetwork.blockExplorer) return;

    try {
      await Linking.openURL(`${connectedNetwork.blockExplorer}/tx/${tx.hash}`);
    } catch (error) {
      toast.show("Cannot open url", {
        type: "danger",
      });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            {renderAction()}
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.row}>
          <View>
            <Text variant="labelMedium">From</Text>
            <Text variant="bodyLarge">
              {truncateAddress(tx.from)}
            </Text>
          </View>

          <View style={styles.alignRight}>
            <Text variant="labelMedium">To</Text>
            <Text variant="bodyLarge">
              {truncateAddress(tx.to || tx.contractAddress)}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.row}>
          <View>
            <Text variant="labelMedium">Nonce</Text>
            <Text variant="bodyLarge">
              #{tx.nonce}
            </Text>
          </View>

          <View style={styles.alignRight}>
            <Text variant="labelMedium">Date</Text>
            <Text variant="bodyLarge">
              {renderTimestamp()}
            </Text>
          </View>
        </View>

        <View style={styles.detailsBox}>
          <View style={styles.row}>
            <Text variant="bodyLarge">Amount</Text>
            <Text variant="bodyLarge">
              {parseFloat(
                ethers.formatEther(ethers.getBigInt(tx.value)),
                5,
              )}{" "}
              {connectedNetwork.currencySymbol}
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodyLarge">Estimated gas fee</Text>
            <Text variant="bodyLarge">
              {calcGasFee()} {connectedNetwork.currencySymbol}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="bodyLarge" style={styles.bold}>
              Total amount
            </Text>
            <Text variant="bodyLarge" style={styles.bold}>
              {calcTotalAmount()} {connectedNetwork.currencySymbol}
            </Text>
          </View>
        </View>

        {connectedNetwork.blockExplorer && (
          <Text
            variant="titleMedium"
            style={styles.link}
            onPress={viewOnBlockExplorer}
          >
            View on block explorer
          </Text>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  detailsBox: {
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 8,
    color: COLORS.primary,
  }
});
