import React, { useState } from 'react'
import Modal from "react-native-modal"
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { VStack, HStack, Icon, Pressable, Text, Input } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import Button from "../../components/Button"
import QRCodeScanner from './QRCodeScanner';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";
import SInfo from "react-native-sensitive-info";
import { Account, addAccount, switchAccount } from '../../store/reducers/Accounts';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onImport: () => void;
}

export default function ImportAccountModal({ isVisible, onClose, onImport }: Props) {
    const [privateKey, setPrivateKey] = useState("")
    const [showScanner, setShowScanner] = useState(false)
    const [error, setError] = useState("")

    const dispatch = useDispatch()

    const accounts: Account[] = useSelector(state => state.accounts)

    const importWallet = async () => {
        try {
            const wallet = new ethers.Wallet(privateKey)

            if (accounts.find(account => account.address == wallet.address) != undefined) {
                setError("Account already exists")
                return
            }

            const createdAccounts = await SInfo.getItem("accounts", {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            })

            await SInfo.setItem("accounts", JSON.stringify([...JSON.parse(createdAccounts), { privateKey: privateKey, address: wallet.address }]), {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            })

            dispatch(addAccount({ address: wallet.address, isImported: true }))
            dispatch(switchAccount(wallet.address))

            onImport()
        } catch (error) {
            setError("Invalid private key")
        }

    }

    const handleInputChange = (value: string) => {
        setPrivateKey(value)
        if (error) {
            setError("")
        }
    }

    return (
        <Modal isVisible={isVisible} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" px="7" py="5" alignItems="center" space="4">
                <Icon as={<Ionicons name="cloud-download" />} color={COLORS.primary} size={4 * FONT_SIZE['xl']} />
                <Text color={COLORS.primary} bold fontSize={1.2 * FONT_SIZE['xl']}>Import Account</Text>
                <Text fontSize={FONT_SIZE['lg']} textAlign="center">Imported accounts won’t be associated with your Paux Secret Recovery Phrase.</Text>

                <VStack space={2} w="full">
                    <Input
                        value={privateKey}
                        borderRadius="lg"
                        variant="filled"
                        fontSize="md"
                        focusOutlineColor={COLORS.primary}
                        InputRightElement={
                            <Pressable onPress={() => setShowScanner(true)} mr="2" _pressed={{ opacity: 0.4 }}>
                                <Icon as={<MaterialCommunityIcons name="qrcode-scan" />} size={1.3 * FONT_SIZE['xl']} color={COLORS.primary} />
                            </Pressable>
                        }
                        secureTextEntry
                        placeholder="Enter your private key here"
                        onChangeText={handleInputChange}
                        _input={{
                            selectionColor: COLORS.primary,
                            cursorColor: COLORS.primary,
                        }}
                    />
                    {error && <Text fontSize="sm" color="red.400">{error}</Text>}
                </VStack>

                <HStack w="full" alignItems="center" justifyContent="space-between">
                    <Button type="outline" text="Cancel" onPress={onClose} style={{ width: "50%", borderRadius: 0 }} />
                    <Button text="Import" onPress={importWallet} style={{ width: "50%", borderRadius: 0 }} />
                </HStack>
            </VStack>

            {showScanner && <QRCodeScanner isOpen={showScanner} onClose={() => setShowScanner(false)} onReadCode={privateKey => {
                setPrivateKey(privateKey)
                setShowScanner(false)
            }} />}
        </Modal>
    )
}