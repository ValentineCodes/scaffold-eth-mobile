import React from "react";
import { StyleSheet, Dimensions, ScrollView, View, TouchableOpacity, Image } from "react-native";
import { Text, Button, IconButton } from "react-native-paper";
import { COLORS } from "../../utils/constants";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import { FONT_SIZE } from "../../utils/styles";

type Props = {};

export default function WalletSetup({}: Props) {
  const navigation = useNavigation();
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      style={styles.container}
    >
      <IconButton
        icon={() => (
          <Ionicons 
            name="arrow-back-outline" 
            size={1.3 * FONT_SIZE["xl"]} 
            color="black" 
          />
        )}
        onPress={() => navigation.goBack()}
        style={styles.navBtn}
      />
      <Image
        source={require("../../assets/icons/wallet_icon.png")}
        style={{
          width: Dimensions.get("window").height * 0.3,
          height: Dimensions.get("window").height * 0.3,
        }}
      />

      <View style={styles.content}>
        <Text
          variant="headlineLarge"
          style={styles.title}
        >
          Wallet Setup
        </Text>
        <Text
          variant="bodyLarge"
          style={styles.subtitle}
        >
          Create your new Wallet or import using a seed phrase if you already
          have an account
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("CreatePassword")}
          style={styles.createButton}
        >
          Create a New Wallet
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("ImportWallet")}
          style={styles.importButton}
        >
          Import Using Seed Phrase
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  navBtn: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  content: {
    width: '100%',
    marginTop: 40
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 2 * FONT_SIZE["xl"],
    fontWeight: 'bold',
    marginTop: 40
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 16
  },
  createButton: {
    marginTop: 40
  },
  importButton: {
    marginTop: 20
  }
});
