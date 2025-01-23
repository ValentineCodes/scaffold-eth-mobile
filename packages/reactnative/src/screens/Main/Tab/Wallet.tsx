
import { Surface } from "react-native-paper";
import React, { useEffect } from "react";
import { BackHandler, NativeEventSubscription } from "react-native";
import Header from "./modules/wallet/Header";
import MainBalance from "./modules/wallet/MainBalance";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Assets from "./modules/wallet/Assets";

let backHandler: NativeEventSubscription;

type Props = {};

function Wallet({}: Props) {
  const isFocused = useIsFocused();

  useFocusEffect(() => {
    backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();

      return true;
    });
  });

  useEffect(() => {
    return () => {
      backHandler?.remove();
    };
  }, []);

  if (!isFocused) return;

  return (
    <Surface style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 4 }}>
      <Header />
      <MainBalance backHandler={backHandler} />
      <Assets />
    </Surface>
  );
}

export default Wallet;
