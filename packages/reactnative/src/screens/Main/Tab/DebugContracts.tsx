import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { getAllContracts } from '../../../../utils/scaffold-eth/contractsData';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';
import ContractUI from './modules/debugContracts/contract/ContractUI';

const Tab = createMaterialTopTabNavigator();

const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData);

type Props = {};

export default function ({}: Props) {
  const isFocused = useIsFocused();

  if (!isFocused) return;
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {contractNames.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: FONT_SIZE['xl'], ...globalStyles.text }}>
            No contracts found!
          </Text>
        </View>
      ) : (
        <>
          <Tab.Navigator
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarIndicatorStyle: {
                backgroundColor: COLORS.primary
              },
              tabBarLabelStyle: {
                textTransform: 'none',
                fontSize: FONT_SIZE['lg'],
                ...globalStyles.text
              },
              tabBarActiveTintColor: COLORS.primary,
              tabBarInactiveTintColor: '#C7C6C7'
            }}
          >
            {contractNames.map(contractName => (
              <Tab.Screen
                key={contractName}
                name={contractName}
                component={ContractUI}
              />
            ))}
          </Tab.Navigator>
        </>
      )}
    </View>
  );
}
