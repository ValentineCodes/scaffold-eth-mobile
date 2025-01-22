import React from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Network, switchNetwork } from "../store/reducers/Networks";
import { COLORS } from "../utils/constants";
import { FONT_SIZE } from "../utils/styles";
import scaffoldConfig from "../../scaffold.config";

export default function SwitchNetwork() {
  const dispatch = useDispatch();
  const networks: Network[] = useSelector((state: any) => state.networks);
  const connectedNetwork: Network = useSelector((state: any) =>
    state.networks.find((network: Network) => network.isConnected),
  );

  if (
    scaffoldConfig.targetNetworks
      .map((network) => network.id)
      .includes(connectedNetwork.id)
  )
    return;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge">Switch Network</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          You are currently connected to {connectedNetwork.name}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {networks.map((network: Network) => (
          <Pressable
            key={network.id.toString()}
            style={[
              styles.networkItem,
              network.isConnected && styles.networkItemActive,
            ]}
            onPress={() => dispatch(switchNetwork(network.id.toString()))}
          >
            <View style={styles.networkInfo}>
              <Text
                variant="titleMedium"
                style={[
                  styles.networkName,
                  network.isConnected && styles.networkNameActive,
                ]}
              >
                {network.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.networkChainId,
                  network.isConnected && styles.networkChainIdActive,
                ]}
              >
                Chain ID: {network.id.toString()}
              </Text>
            </View>
            {network.isConnected && (
              <IconButton
                icon="check"
                size={24}
                iconColor={COLORS.primary}
              />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 16,
    gap: 4,
  },
  subtitle: {
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  networkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  networkItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  networkInfo: {
    gap: 4,
  },
  networkName: {
    fontSize: FONT_SIZE.lg,
  },
  networkNameActive: {
    color: COLORS.primary,
  },
  networkChainId: {
    color: "#666",
  },
  networkChainIdActive: {
    color: COLORS.primary,
  },
});
