import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';

import Providers from './utils/Providers';
import Navigation from './utils/Navigation';


export default () => {
  return (
    <Providers>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Navigation />
      </SafeAreaView>
    </Providers>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
