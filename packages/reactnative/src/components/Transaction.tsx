import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { Network } from "../store/reducers/Networks";
import { truncateAddress } from "../utils/helperFunctions";
import { COLORS } from "../utils/constants";
import { FONT_SIZE } from "../utils/styles";
import { ethers } from "ethers";
import Tag from "./Tag";
import Clipboard from "@react-native-clipboard/clipboard";
import { useToast } from "react-native-toast-notifications";
import { Linking } from "react-native";

type Props = {
  tx: {
    hash: string;
    from: string;
    to: string;
    value: bigint;
    status?: "success" | "error" | "pending";
  };
};

export default function Transaction({ tx }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toast = useToast();

  const connectedNetwork: Network = useSelector((state: any) =>
    state.networks.find((network: Network) => network.isConnected),
  );

  const copyHash = () => {
    Clipboard.setString(tx.hash);
    toast.show("Copied to clipboard", { type: "success" });
  };

  const openExplorer = () => {
    Linking.openURL(`${connectedNetwork.blockExplorer}/tx/${tx.hash}`);
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon={tx.status === "error" ? "close-circle" : "check-circle"}
            size={24}
            iconColor={tx.status === "error" ? COLORS.error : COLORS.primary}
          />
          <View>
            <Text variant="titleMedium">
              {ethers.formatEther(tx.value)} {connectedNetwork.currencySymbol}
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {new Date().toLocaleString()}
            </Text>
          </View>
        </View>
        <Tag
          text={tx.status || "pending"}
          type={tx.status as "success" | "error" | "warning"}
        />
      </View>

      {isExpanded && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text variant="bodyMedium">From:</Text>
            <Text variant="bodyMedium">{truncateAddress(tx.from)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text variant="bodyMedium">To:</Text>
            <Text variant="bodyMedium">{truncateAddress(tx.to)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text variant="bodyMedium">Hash:</Text>
            <View style={styles.hashContainer}>
              <Text variant="bodyMedium" style={styles.hash}>
                {truncateAddress(tx.hash)}
              </Text>
              <IconButton
                icon="content-copy"
                size={20}
                onPress={copyHash}
              />
              <IconButton
                icon="open-in-new"
                size={20}
                onPress={openExplorer}
              />
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  date: {
    color: "#666",
  },
  details: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hashContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hash: {
    color: COLORS.primary,
  },
});
