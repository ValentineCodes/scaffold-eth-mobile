import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { COLORS } from '../../../../../utils/constants';
import { FONT_SIZE } from '../../../../../utils/styles';
import NFTs from './NFTs';
// screens
import Tokens from './Tokens';

const Tab = createMaterialTopTabNavigator();

type Props = {};

export default function Assets({}: Props) {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: FONT_SIZE['lg'],
            fontWeight: 'bold'
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#999',

          tabBarStyle: {
            backgroundColor: 'transparent',
            position: 'absolute',
            left: 75,
            right: 75,
            top: 5,
            height: 50,
            width: 'auto',
            elevation: 0
          },
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.primary
          }
        }}
      >
        <Tab.Screen name="Tokens" component={Tokens} />
        <Tab.Screen name="NFTs" component={NFTs} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    }
})