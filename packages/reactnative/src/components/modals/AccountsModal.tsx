import { VStack, HStack, Icon, Divider, ScrollView, Pressable, Text } from 'native-base';
import React, { useState } from 'react'
import Modal from "react-native-modal"
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { FONT_SIZE } from '../../utils/styles';
import { truncateAddress } from '../../utils/helperFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { Account, addAccount, switchAccount } from '../../store/reducers/Accounts';
import Button from "../../components/Button"
import Blockie from '../Blockie'
import SInfo from "react-native-sensitive-info"

import { Dimensions } from 'react-native';

import { COLORS } from '../../utils/constants';
import ImportAccountModal from './ImportAccountModal';
import { importMnemonic } from 'react-native-web3-wallet';
import { useToast } from 'react-native-toast-notifications';


type Props = {
    isVisible: boolean;
    setVisibility: (isVisible: boolean) => void;
    onClose: () => void;
}

export default function AccountsModal({ isVisible, setVisibility, onClose }: Props) {
    const dispatch = useDispatch()
    const toast = useToast()

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [showImportAccountModal, setShowImportAccountModal] = useState(false)

    const handleAccountSelection = (account: string) => {
        if (account !== connectedAccount.address) {
            dispatch(switchAccount(account))
            setVisibility(false)
        }
    }

    const createAccount = async () => {
        const mnemonic = await SInfo.getItem("mnemonic", {
            sharedPreferencesName: "sern.android.storage",
            keychainService: "sern.ios.storage",
        })

        let newAccount

        for (let i = 0; i < Infinity; i++) {
            const wallet = await importMnemonic(mnemonic, "", `m/44'/60'/0'/0/${i}`, true)

            if (accounts.find(account => account.address == wallet.address) == undefined) {
                newAccount = {
                    address: wallet.address,
                    privateKey: wallet.privateKey
                }
                break
            }
        }

        if (!newAccount) {
            toast.show("Failed to create account!", { type: "danger" })
            return
        }

        const createdAccounts = await SInfo.getItem("accounts", {
            sharedPreferencesName: "sern.android.storage",
            keychainService: "sern.ios.storage",
        })

        await SInfo.setItem("accounts", JSON.stringify([...JSON.parse(createdAccounts), { privateKey: newAccount.privateKey, address: newAccount.address }]), {
            sharedPreferencesName: "sern.android.storage",
            keychainService: "sern.ios.storage",
        })

        dispatch(addAccount({ address: newAccount.address, isImported: false }))

        dispatch(switchAccount(newAccount.address))
        setVisibility(false)
    }

    return (
        <Modal isVisible={isVisible} animationIn="slideInRight" animationOut="slideOutLeft" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" p="5" space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['xl']} bold>Accounts</Text>
                    <Pressable onPress={onClose} _pressed={{ opacity: 0.4 }}>
                        <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} />
                    </Pressable>
                </HStack>

                <Divider bgColor="muted.300" mt="2" />

                <ScrollView maxH={Dimensions.get("window").height / 4.8}>
                    {accounts.map((account, index) => (
                        <Pressable key={account.address} onPress={() => handleAccountSelection(account.address)}>
                            <HStack alignItems="center" justifyContent="space-between" paddingY={3} borderBottomWidth={index === accounts.length - 1 ? 0 : 1} borderBottomColor="muted.300">
                                <HStack alignItems="center" space={4}>
                                    <Blockie address={account.address} size={1.7 * FONT_SIZE["xl"]} />
                                    <VStack>
                                        <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">{account.name}</Text>
                                        <Text>{truncateAddress(account.address)}</Text>
                                    </VStack>
                                </HStack>
                                {account.isConnected && <Icon as={<Ionicons name="checkmark-done" />} color={COLORS.primary} size={1.2 * FONT_SIZE['xl']} />}
                            </HStack>
                        </Pressable>
                    ))}
                </ScrollView>

                <HStack w="full" mt="5" alignItems="center" justifyContent="space-between">
                    <Button text="Create" onPress={createAccount} style={{ width: "50%", borderRadius: 0 }} />
                    <Button type="outline" text="Import" onPress={() => setShowImportAccountModal(true)} style={{ width: "50%", borderRadius: 0 }} />
                </HStack>
            </VStack>

            <ImportAccountModal isVisible={showImportAccountModal} onClose={() => setShowImportAccountModal(false)} onImport={() => {
                setShowImportAccountModal(false)
                onClose()
            }} />
        </Modal>
    )
}