import { Text, View } from 'native-base'
import React from 'react'

import ContractUI from "./modules/debugContracts/contract/ContractUI"
import { getAllContracts } from '../../../../utils/scaffold-eth/contractsData'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';
import { useIsFocused } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData);

type Props = {}

export default function ({ }: Props) {
    const isFocused = useIsFocused()

    if (!isFocused) return
    return (
        <View flex={1} bgColor={"white"}>
            {contractNames.length === 0 ? (
                <View flex={1} alignItems={"center"} justifyContent={"center"}>
                    <Text fontSize={"xl"}>No contracts found!</Text>
                </View>
            ) : (
                <>
                    <Tab.Navigator screenOptions={{
                        tabBarScrollEnabled: true,
                        tabBarIndicatorStyle: {
                            backgroundColor: COLORS.primary,
                        },
                        tabBarLabelStyle: {
                            textTransform: 'none',
                            fontSize: FONT_SIZE["lg"]
                        },
                        tabBarActiveTintColor: COLORS.primary,
                        tabBarInactiveTintColor: '#C7C6C7',
                    }}>
                        {
                            contractNames.map(contractName => (
                                <Tab.Screen key={contractName} name={contractName} component={ContractUI} />
                            ))
                        }
                    </Tab.Navigator>
                </>
            )}
        </View>
    )
}