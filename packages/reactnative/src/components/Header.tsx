import { CheckIcon, HStack, Icon, Select, Text } from 'native-base'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Network, switchNetwork } from '../store/reducers/Networks'
import { Account } from '../store/reducers/Accounts'
import { FONT_SIZE } from '../utils/styles'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { COLORS } from '../utils/constants'
import { Linking, StyleSheet } from 'react-native'
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu'
import Blockie from './Blockie'
import { useToast } from 'react-native-toast-notifications'
import Share from 'react-native-share';

type Props = {}

export default function Header({ }: Props) {
    const dispatch = useDispatch()

    const networks: Network[] = useSelector(state => state.networks)
    const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const toast = useToast()

    const handleNetworkSelecttion = (chainId: string) => {
        dispatch(switchNetwork(chainId))
    }

    const shareAddress = async () => {
        try {
            await Share.open({ message: connectedAccount.address })
        } catch (error) {
            return
        }
    }

    const viewOnBlockExplorer = async () => {
        if (!connectedNetwork.blockExplorer) return

        try {
            await Linking.openURL(`${connectedNetwork.blockExplorer}/address/${connectedAccount.address}`)
        } catch (error) {
            toast.show("Cannot open url", {
                type: "danger"
            })
        }
    }

    return (
        <HStack alignItems="center" justifyContent="space-between" py="4" borderBottomColor="#ccc">
            <Text fontSize={"2xl"} fontWeight={"semibold"}>SERN</Text>

            <Select
                selectedValue={connectedNetwork.chainId.toString()}
                flex="1"
                borderRadius={25}
                mx="10"
                accessibilityLabel="Choose Network"
                placeholder="Choose Network"
                _selectedItem={{
                    bg: COLORS.primary,
                    endIcon: <CheckIcon size={5} color="white" />
                }}
                dropdownIcon={<Icon as={<Ionicons name="chevron-down" />} size={1.3 * FONT_SIZE['xl']} color="black" mr="2" />}
                fontSize={FONT_SIZE['md']}
                onValueChange={handleNetworkSelecttion}
            >
                {networks.map((network: Network) => <Select.Item key={network.chainId} label={network.name} value={network.chainId.toString()} />)}
            </Select>

            <Menu>
                <MenuTrigger><Blockie address={"0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D901"} size={1.7 * FONT_SIZE["xl"]} /></MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => console.log("")} style={styles.menuOption}>
                        <Icon as={<Ionicons name="layers-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                        <Text fontSize={FONT_SIZE['lg']}>Accounts</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => console.log("")} style={styles.menuOption}>
                        <Icon as={<Ionicons name="grid-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                        <Text fontSize={FONT_SIZE['lg']}>Account details</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => console.log("")} style={styles.menuOption}>
                        <Icon as={<Ionicons name="key-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                        <Text fontSize={FONT_SIZE['lg']}>Show seed phrase</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => console.log("")} style={styles.menuOption}>
                        <Icon as={<Ionicons name="radio-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                        <Text fontSize={FONT_SIZE['lg']}>Connected sites</Text>
                    </MenuOption>
                    <MenuOption onSelect={shareAddress} style={styles.menuOption}>
                        <Icon as={<Ionicons name="share-social-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                        <Text fontSize={FONT_SIZE['lg']}>Share address</Text>
                    </MenuOption>
                    {connectedNetwork.blockExplorer && <MenuOption onSelect={viewOnBlockExplorer} style={styles.menuOption}>
                        <Icon as={<Ionicons name="open-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                        <Text fontSize={FONT_SIZE['lg']}>View on block explorer</Text>
                    </MenuOption>}
                </MenuOptions>
            </Menu>
        </HStack>
    )
}

const styles = StyleSheet.create({
    menuOption: {
        flexDirection: 'row',
        alignItems: "center",
        padding: 10,
    }
})