import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  BackHandler,
  NativeEventSubscription,
  StyleSheet,
  View
} from 'react-native';
import Assets from './modules/wallet/Assets';
import Header from './modules/wallet/Header';
import MainBalance from './modules/wallet/MainBalance';

let backHandler: NativeEventSubscription;

type Props = {};

export default function Wallet({}: Props) {
  const isFocused = useIsFocused();

  useFocusEffect(() => {
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
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
    <View style={styles.container}>
      <Header />
      <MainBalance backHandler={backHandler} />
      <Assets />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 4
  }
});
