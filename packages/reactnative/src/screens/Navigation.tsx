import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import ConfirmSeedPhrase from './Authentication/ConfirmSeedPhrase';
import CreatePassword from './Authentication/CreatePassword';
import GenerateSeedPhrase from './Authentication/GenerateSeedPhrase';
import ImportWallet from './Authentication/ImportWallet';
import Login from './Authentication/Login';
import Onboarding from './Authentication/Onboarding';
import SecureWallet from './Authentication/SecureWallet';
import WalletSetup from './Authentication/WalletSetup';
import Main from './Main';
import TokenDetails from './TokenDetails';
import Transfer from './Transfer';

type Props = {};

type AppStackParamsList = {
  Onboarding: undefined;
  WalletSetup: undefined;
  ImportWallet: undefined;
  GenerateSeedPhrase: undefined;
  SecureWallet: undefined;
  ConfirmSeedPhrase: undefined;
  CreatePassword: undefined;
  Login: undefined;
  Main: undefined;
  Transfer: undefined;
  TokenDetails: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamsList>();

export default function Navigation({}: Props) {
  const auth = useSelector((state: any) => state.auth);

  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        {!auth.isLoggedIn && (
          <>
            <AppStack.Screen name="Onboarding" component={Onboarding} />
            <AppStack.Screen name="WalletSetup" component={WalletSetup} />
            <AppStack.Screen name="ImportWallet" component={ImportWallet} />
            <AppStack.Screen name="SecureWallet" component={SecureWallet} />
            <AppStack.Screen
              name="GenerateSeedPhrase"
              component={GenerateSeedPhrase}
            />
            <AppStack.Screen
              name="ConfirmSeedPhrase"
              component={ConfirmSeedPhrase}
            />
            <AppStack.Screen name="CreatePassword" component={CreatePassword} />
          </>
        )}
        <AppStack.Screen name="Login" component={Login} />
        <AppStack.Screen name="Main" component={Main} />
        <AppStack.Screen name="Transfer" component={Transfer} />
        <AppStack.Screen name="TokenDetails" component={TokenDetails} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
