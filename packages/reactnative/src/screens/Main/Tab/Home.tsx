import { View } from 'native-base'
import React from 'react'
import { useDeployedContractInfo } from '../../../hooks/scaffold-eth/useDeployedContractInfo'

type Props = {}

export default function Home({ }: Props) {
    const { data, isLoading } = useDeployedContractInfo("YourContract")

    return (
        <View></View>
    )
}