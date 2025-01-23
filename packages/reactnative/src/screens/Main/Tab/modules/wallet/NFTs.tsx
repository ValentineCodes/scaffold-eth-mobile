import { FlatList, Pressable, ScrollView, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { TextInput, Text, Divider, Surface } from "react-native-paper";

type Props = {};

function NFTs({}: Props) {
  return (
    <Surface style={{paddingTop: 75, padding: 2}}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
        <TextInput
          mode="outlined"
          placeholder="Search NFTs"
          style={{ width: "85%" }}
        />
        <Icon
          name="add"
          size={30}
          style={{ color: "white", backgroundColor: "blue", padding: 5 }}
        />
      </View>
    </Surface>
  );
}

export default NFTs;
