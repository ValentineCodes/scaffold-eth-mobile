import { HStack, VStack, Icon, Text, Input, Pressable, Button as RNButton } from 'native-base'
import React, { useState } from 'react'
import Modal from 'react-native-modal';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { FONT_SIZE } from '../../utils/styles';
import { COLORS } from '../../utils/constants';
import Blockie from '../Blockie';
import CopyableText from '../CopyableText';
import { useSelector } from 'react-redux';
import { Account } from '../../store/reducers/Accounts';
import { truncateAddress } from '../../utils/helperFunctions'
import SInfo from "react-native-sensitive-info";
import Button from '../Button';
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications';
import { StyleSheet } from 'react-native';

type Props = {
    isVisible: boolean;
    onClose: () => void;
}

export default function PrivateKeyModal({ isVisible, onClose }: Props) {
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const toast = useToast()

    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [privateKey, setPrivateKey] = useState("")

    const showPrivateKey = async () => {
        if (!password) {
            setError("Password cannot be empty")
            return
        }

        const _security = await SInfo.getItem("security", {
            sharedPreferencesName: "sern.android.storage",
            keychainService: "sern.ios.storage",
        });
        const security = JSON.parse(_security!)

        if (password !== security.password) {
            setError("Incorrect password!")
            return
        }

        const accounts = await SInfo.getItem("accounts", {
            sharedPreferencesName: "sern.android.storage",
            keychainService: "sern.ios.storage",
        })

        const wallet: Wallet = Array.from(JSON.parse(accounts)).find(wallet => wallet.address == connectedAccount.address)

        setPrivateKey(wallet.privateKey)
    }

    const handleInputChange = (value: string) => {
        setPassword(value)
        if (error) {
            setError("")
        }
    }

    const copyPrivateKey = () => {
        Clipboard.setString(privateKey)
        toast.show("Copied to clipboard", {
            type: 'success'
        })
    }

    const handleOnClose = () => {
        onClose()
        setPrivateKey("")
        setPassword("")
    }

    return (
        <Modal isVisible={isVisible} animationIn="slideInLeft" animationOut="slideOutRight" onBackButtonPress={handleOnClose} onBackdropPress={handleOnClose}>
            <VStack bgColor="white" borderRadius="30" p="5" alignItems="center" space="4" w="full">
                <HStack alignItems="center" justifyContent="space-between" space="2" w="full">
                    <Text fontSize={1.1 * FONT_SIZE['xl']} bold>Show private key</Text>
                    <Pressable onPress={handleOnClose} _pressed={{ opacity: 0.4 }}>
                        <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} color="black" />
                    </Pressable>
                </HStack>

                <VStack alignItems="center" space="1">
                    <Blockie address={connectedAccount.address} size={2.5 * FONT_SIZE['xl']} />
                    <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{connectedAccount.name}</Text>
                    <CopyableText value={connectedAccount.address} displayText={truncateAddress(connectedAccount.address)} containerStyle={styles.addressContainer} textStyle={styles.addressText} iconStyle={{ color: COLORS.primary }} />
                </VStack>

                {privateKey ? (
                    <HStack alignItems="center" w="full" borderWidth="1" borderColor={COLORS.primary} borderRadius={10} p="4">
                        <Text fontSize={FONT_SIZE['lg']} w="90%" mr="2">{privateKey}</Text>
                        <Pressable onPress={copyPrivateKey} _pressed={{ opacity: 0.4 }}><Icon as={<Ionicons name="copy" />} size={5} color={COLORS.primary} /></Pressable>
                    </HStack>
                ) : (
                    <VStack w="full" space={2}>
                        <Text fontSize={FONT_SIZE["xl"]} fontWeight="medium">Enter your password</Text>
                        <Input
                            value={password}
                            borderRadius="lg"
                            variant="filled"
                            fontSize="md"
                            focusOutlineColor={COLORS.primary}
                            secureTextEntry
                            placeholder="Password"
                            onChangeText={handleInputChange}
                            onSubmitEditing={showPrivateKey}
                            _input={{
                                selectionColor: COLORS.primary,
                                cursorColor: COLORS.primary,
                            }}
                        />
                        {error && <Text fontSize="sm" color="red.400">{error}</Text>}
                    </VStack>
                )}


                <HStack alignItems="center" w="full" borderWidth="1" borderColor="red.400" borderRadius={10} p="4" bgColor="red.100">
                    <Icon as={<Ionicons name="eye-off" />} size={1.3 * FONT_SIZE['xl']} color="red.400" />
                    <Text fontSize={FONT_SIZE["md"]} mx="4">Never disclose this key. Anyone with your private key can fully control your account, including transferring away any of your funds.</Text>
                </HStack>

                {privateKey ? (
                    <Button text="Done" onPress={handleOnClose} />
                ) : (<HStack w="full" alignItems="center" justifyContent="space-between">
                    <RNButton py="4" bgColor="red.100" w="50%" onPress={handleOnClose} _pressed={{ backgroundColor: 'red.200' }}><Text color="red.400" bold fontSize="md">Cancel</Text></RNButton>
                    <Button text="Reveal" onPress={showPrivateKey} style={{ width: "50%", borderRadius: 0 }} />
                </HStack>)}
            </VStack>
        </Modal>
    )
}

const styles = StyleSheet.create({
    addressContainer: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 15
    },
    addressText: {
        fontWeight: '700',
        fontSize: FONT_SIZE['md'],
        color: COLORS.primary
    }
})