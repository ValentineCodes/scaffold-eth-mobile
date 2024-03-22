import React from 'react'
import { Button, HStack, Text, View } from "native-base"
import { useWeb3Modal } from '@web3modal/wagmi-react-native'
import { useAccount } from 'wagmi'
import AccountDetails from '../../components/AccountDetails'


type Props = {}

export default function Home({ }: Props) {
    const { open, close } = useWeb3Modal()
    const { address, isConnecting, isDisconnected } = useAccount()

    return (
        <View flex={1}>
            <HStack alignItems="center" justifyContent="space-between" px="4" py="2">
                <Text>SE</Text>

                {address ? <AccountDetails address={address} /> : <Button onPress={() => open()}>Connect</Button>}
            </HStack>
        </View>
    )
}