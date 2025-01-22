import React from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { FONT_SIZE } from "../../../utils/styles";
import { useSelector } from "react-redux";
import { COLORS } from "../../../utils/constants";
import Blockie from "../../../components/Blockie";
import { truncateAddress } from "../../../utils/helperFunctions";

type Props = {};

export default function Recents({}: Props) {
  const recipients: string[] = useSelector((state: any) => state.recipients);

  return (
    <View style={styles.container}>
      <>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Recents
          </Text>
          <TouchableOpacity>
            <Text variant="titleMedium" style={styles.clearText}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          keyExtractor={(item) => item}
          data={recipients}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => null}>
              <View style={styles.recipientRow}>
                <Blockie address={item} size={1.7 * FONT_SIZE["xl"]} />
                <Text variant="titleLarge" style={styles.address}>
                  {truncateAddress(item)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: 'bold'
  },
  clearText: {
    color: COLORS.primary
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16
  },
  address: {
    fontWeight: '500'
  }
});
