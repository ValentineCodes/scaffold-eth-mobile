import React from 'react'
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
import Main from "./Main"
import Transfer from './Transfer'
import { useSelector } from 'react-redux';
import Example from './Example';

type Props = {}

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
    Example: undefined
}

const AppStack = createNativeStackNavigator<AppStackParamsList>();

export default function Navigation({ }: Props) {
    const auth = useSelector((state: any) => state.auth)
    return (
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
                <AppStack.Screen name="Login" component={Login} />
                <AppStack.Screen name="Main" component={Main} />
                <AppStack.Screen name="Transfer" component={Transfer} />
                <AppStack.Screen name="Example" component={Example} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}