import { FlatList, Pressable, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { TextInput, Text, Divider, Surface } from "react-native-paper";

const TOKENS = [
  {
    name: "BuidlGuidl", 
    symbol: "BG",
    address: "0xF51CD0d607c82db2B70B678554c52C266a9D49B6",
    balance: "99.5",
  },
  {
    name: "AfterLife",
    symbol: "AL", 
    address: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D901",
    balance: "15.5",
  },
];

type Props = {};

function Tokens({}: Props) {
  return (
    <Surface>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
        <TextInput
          mode="outlined"
          placeholder="Search tokens"
          style={{ width: "85%" }}
        />
        <Icon
          name="add"
          size={30}
          style={{ color: "white", backgroundColor: "blue", padding: 5 }}
        />
      </View>

      <FlatList
        ItemSeparatorComponent={() => <Divider />}
        keyExtractor={(token) => token.address}
        data={TOKENS}
        renderItem={({ item }) => (
          <Pressable style={{ paddingVertical: 5 }}>
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {item.name}
            </Text>
            <Text variant="bodyMedium">
              {item.balance}
            </Text>
          </Pressable>
        )}
      />
    </Surface>
  );
}

export default Tokens;
