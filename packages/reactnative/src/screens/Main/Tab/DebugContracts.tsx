import { View } from 'native-base'
import React from 'react'

import ContractUI from "./modules/debugContracts/contract/ContractUI"
import { getAllContracts } from '../../../../utils/scaffold-eth/contractsData'

const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData);

type Props = {}

export default function ({ }: Props) {
    return (
        <View flex={1} bgColor={"white"}>
            {
                contractNames.map(contractName => (
                    <ContractUI
                        key={contractName}
                        contractName={contractName}
                    />
                ))
            }
        </View>
    )
}