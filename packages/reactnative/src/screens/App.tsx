import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Onboarding from './Authentication/Onboarding'
import WalletSetup from './Authentication/WalletSetup';
import GenerateSeedPhrase from './Authentication/GenerateSeedPhrase';
import ConfirmSeedPhrase from './Authentication/ConfirmSeedPhrase';
import ImportWallet from './Authentication/ImportWallet'
import SecureWallet from './Authentication/SecureWallet'
import CreatePassword from './Authentication/CreatePassword';
import Login from './Authentication/Login'
import Home from './Home'
import Transfer from './Transfer'
import { useSelector } from 'react-redux';
// import BootSplash from "react-native-bootsplash";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Providers from './Providers';

type AppStackParamsList = {
  Onboarding: undefined;
  WalletSetup: undefined;
  ImportWallet: undefined;
  GenerateSeedPhrase: undefined;
  SecureWallet: undefined;
  ConfirmSeedPhrase: undefined;
  CreatePassword: undefined;
  Login: undefined;
  Home: undefined;
  Transfer: undefined;
}

const AppStack = createNativeStackNavigator<AppStackParamsList>();

function App(): JSX.Element {
  const auth = useSelector((state: any) => state.auth)

  useEffect(() => {
    (async () => {
      try {
        changeNavigationBarColor('#ffffff')
        // await BootSplash.hide({ fade: true });
      } catch (error) {
        return
      }
    })()
  }, [])

  return (
    <Providers>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <NavigationContainer>
          <AppStack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            {
              !auth.isLoggedIn && (
                <>
                  <AppStack.Screen name="Onboarding" component={Onboarding} />
                  <AppStack.Screen name="WalletSetup" component={WalletSetup} />
                  <AppStack.Screen name="ImportWallet" component={ImportWallet} />
                  <AppStack.Screen name="SecureWallet" component={SecureWallet} />
                  <AppStack.Screen name="GenerateSeedPhrase" component={GenerateSeedPhrase} />
                  <AppStack.Screen name="ConfirmSeedPhrase" component={ConfirmSeedPhrase} />
                  <AppStack.Screen name="CreatePassword" component={CreatePassword} />
                </>
              )
            }
            {/* <AppStack.Screen name="Login" component={Login} /> */}
            <AppStack.Screen name="Home" component={Home} />
            <AppStack.Screen name="Transfer" component={Transfer} />
          </AppStack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 5
  }
})

export default App;
