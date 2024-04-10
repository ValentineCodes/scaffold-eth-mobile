import { Text, Select, CheckIcon, HStack, Icon, Image } from 'native-base'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Network, switchNetwork } from '../../../../../store/reducers/Networks'
import { Account } from '../../../../../store/reducers/Accounts'
import { Linking, StyleSheet } from 'react-native'
import { useToast } from 'react-native-toast-notifications'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import Share from 'react-native-share';
import Blockie from '../../../../../components/Blockie'

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import AccountDetailsModal from '../../../../../components/modals/AccountDetailsModal'
import { FONT_SIZE, WINDOW_WIDTH } from '../../../../../utils/styles'
import { COLORS } from '../../../../../utils/constants'
import AccountsModal from '../../../../../components/modals/AccountsModal'
import SeedPhraseModal from '../../../../../components/modals/SeedPhraseModal'

type Props = {}

export default function Header({ }: Props) {
    const dispatch = useDispatch()
    const [isAccountModalVisible, setIsAccountModalVisible] = useState(false)
    const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false)
    const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false)

    const networks: Network[] = useSelector(state => state.networks)
    const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))

    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const toast = useToast()

    const handleNetworkSelecttion = (id: string) => {
        dispatch(switchNetwork(id))
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
            <Image source={require("../../../../../assets/images/logo.png")} alt='Paux' width={WINDOW_WIDTH * 0.08} height={WINDOW_WIDTH * 0.08} />

            <Select
                selectedValue={connectedNetwork.id.toString()}
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
                {networks.map((network: Network) => <Select.Item key={network.id} label={network.name} value={network.id.toString()} />)}
            </Select>

            <Menu>
                <MenuTrigger><Blockie address={connectedAccount.address} size={1.7 * FONT_SIZE["xl"]} /></MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => setIsAccountModalVisible(true)} style={styles.menuOption}>
                        <Icon as={<Ionicons name="layers-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                        <Text fontSize={FONT_SIZE['lg']}>Accounts</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => setShowAccountDetailsModal(true)} style={styles.menuOption}>
                        <Icon as={<Ionicons name="grid-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                        <Text fontSize={FONT_SIZE['lg']}>Account details</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => setShowSeedPhraseModal(true)} style={styles.menuOption}>
                        <Icon as={<Ionicons name="key-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                        <Text fontSize={FONT_SIZE['lg']}>Show seed phrase</Text>
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

            <AccountsModal isVisible={isAccountModalVisible} setVisibility={setIsAccountModalVisible} onClose={() => setIsAccountModalVisible(false)} />

            {showSeedPhraseModal && <SeedPhraseModal isVisible={showSeedPhraseModal} onClose={() => setShowSeedPhraseModal(false)} />}
            {showAccountDetailsModal && <AccountDetailsModal isVisible={showAccountDetailsModal} onClose={() => setShowAccountDetailsModal(false)} />}
        </HStack>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 3 * FONT_SIZE["xl"],
        height: 3 * FONT_SIZE["xl"],
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: "center",
        padding: 10,
    }
})