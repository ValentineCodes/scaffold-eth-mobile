import { HStack, VStack, Text, View } from 'native-base'
import React from 'react'
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu'
import { FONT_SIZE } from '../utils/styles'
import Blockie from './Blockie'
import { truncateAddress } from '../utils/helperFunctions'
import { Pressable, StyleSheet } from 'react-native'
import { useWeb3Modal } from '@web3modal/wagmi-react-native'
import { useNetwork } from 'wagmi'

type Props = {
    address: string
}

export default function AccountDetails({ address }: Props) {
    const { open } = useWeb3Modal()
    const { chain } = useNetwork()

    return (
        <HStack>
            <Pressable style={styles.addressContainer} onPress={() => open({ view: "Account" })}>
                <Blockie address={address} size={1.7 * FONT_SIZE["xl"]} />
                <Text ml="2">{truncateAddress(address)}</Text>
            </Pressable>
        </HStack>
    )
}

const styles = StyleSheet.create({
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 30,
        padding: 4,
    }
})