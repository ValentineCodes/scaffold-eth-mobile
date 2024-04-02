import { View } from 'native-base'
import React from 'react'
import { useDeployedContractInfo } from '../../../hooks/scaffold-eth/useDeployedContractInfo'
import useNetwork from '../../../hooks/scaffold-eth/useNetwork'

type Props = {}

export default function Home({ }: Props) {
    const { data, isLoading } = useDeployedContractInfo("YourContract")
    const network = useNetwork()

    return (
        <View flex={"1"} bgColor={"white"}></View>
    )
}