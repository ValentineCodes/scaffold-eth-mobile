import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";

// import BootSplash from "react-native-bootsplash";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import Providers from "./Providers";
import Navigation from "./Navigation";
import SwitchNetwork from "../components/SwitchNetwork";
import { Text } from "native-base";

function App(): JSX.Element {
  useEffect(() => {
    (async () => {
      try {
        changeNavigationBarColor("#ffffff");
        // await BootSplash.hide({ fade: true });
      } catch (error) {
        return;
      }
    })();
  }, []);

  return (
    <Providers>
      <SafeAreaView style={styles.container}>
        {/* <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Navigation />
        <SwitchNetwork /> */}

        <Text>Hello</Text>
      </SafeAreaView>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    paddingHorizontal: 5,
  },
});

export default App;
