import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Address } from "viem";
import useNetwork from "../../hooks/scaffold-eth/useNetwork";
import useBalance from "../../hooks/scaffold-eth/useBalance";
import { TextStyle } from "react-native";

type Props = {
  address: string;
  style?: TextStyle;
};

export default function Balance({ address, style }: Props) {
  const network = useNetwork();
  const { balance, isLoading } = useBalance({ address });

  if (isLoading) return;

  return (
    <View style={styles.container}>
      <Text style={style}>
        {balance} {network.currencySymbol}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
