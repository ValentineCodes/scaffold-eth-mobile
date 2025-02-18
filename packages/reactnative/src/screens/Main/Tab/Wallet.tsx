import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  BackHandler,
  NativeEventSubscription,
  ScrollView,
  StyleSheet
} from 'react-native';
import Footer from './modules/wallet/Footer';
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header />
      <MainBalance backHandler={backHandler} />
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4
  }
});
