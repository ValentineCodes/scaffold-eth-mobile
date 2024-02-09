import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import Home from '../Home'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type StackScreenParamsList = {
    Home: undefined,
};

const StackScreen = createNativeStackNavigator<StackScreenParamsList>();

export default function Navigation() {
    return (
        <NavigationContainer>
            <StackScreen.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}>
                <StackScreen.Screen name="Home" component={Home} />
            </StackScreen.Navigator>
        </NavigationContainer>
    )
}