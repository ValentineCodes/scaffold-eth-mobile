import { HStack, Pressable, Text, View } from 'native-base'
import React, { useEffect, useState } from 'react'

import ContractUI from "./modules/debugContracts/contract/ContractUI"
import { getAllContracts } from '../../../../utils/scaffold-eth/contractsData'
import { COLORS } from '../../../utils/constants';

const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData);

type Props = {}

export default function ({ }: Props) {
    const [selectedContract, setSelectedContract] = useState(contractNames[0]);

    useEffect(() => {
        if (!contractNames.includes(selectedContract)) {
            setSelectedContract(contractNames[0]);
        }
    }, [selectedContract, setSelectedContract]);

    return (
        <View flex={1} bgColor={"white"}>
            {contractNames.length === 0 ? (
                <View flex={1} alignItems={"center"} justifyContent={"center"}>
                    <Text fontSize={"xl"}>No contracts found!</Text>
                </View>
            ) : (
                <>
                    {contractNames.length > 1 && (
                        <HStack alignItems={"center"} flexWrap={"wrap"} justifyContent={"center"} space={"4"}>
                            {contractNames.map(contractName => (
                                <Pressable
                                    key={contractName}
                                    bgColor={contractName === selectedContract ? COLORS.primary : COLORS.primaryLight}
                                    rounded={"xl"}
                                    px={"2"} py={"1"} mt={"3"}
                                    onPress={() => setSelectedContract(contractName)}

                                >
                                    <Text fontSize={"md"} fontWeight={"medium"}>{contractName}</Text>
                                </Pressable>
                            ))}
                        </HStack>
                    )}
                    {
                        contractNames.map(contractName => (
                            contractName === selectedContract &&
                            <ContractUI
                                key={contractName}
                                contractName={contractName}
                            />
                        ))
                    }
                </>
            )}
        </View>
    )
}