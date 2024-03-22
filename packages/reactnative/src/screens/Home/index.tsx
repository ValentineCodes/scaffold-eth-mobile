import React from 'react'
import { Button, HStack, Text, View } from "native-base"
import { useWeb3Modal } from '@web3modal/wagmi-react-native'
import { useAccount } from 'wagmi'
import AccountDetails from '../../components/AccountDetails'
import Header from '../../components/Header'


type Props = {}

export default function Home({ }: Props) {
    const { open, close } = useWeb3Modal()
    const { address, isConnecting, isDisconnected } = useAccount()

    return (
        <View flex={1} bgColor={"white"} px={"5"}>
            <Header />
        </View>
    )
}