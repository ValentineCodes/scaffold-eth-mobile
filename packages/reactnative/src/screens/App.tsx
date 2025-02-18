import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
// import BootSplash from "react-native-bootsplash";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Navigation from './Navigation';
import Providers from './Providers';

function App(): JSX.Element {
  useEffect(() => {
    (async () => {
      try {
        changeNavigationBarColor('#ffffff');
        // await BootSplash.hide({ fade: true });
      } catch (error) {
        return;
      }
    })();
  }, []);

  return (
    <Providers>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Navigation />
      </SafeAreaView>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

export default App;
