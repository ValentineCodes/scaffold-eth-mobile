import { HStack, VStack, Icon, Text, Input, Pressable, Button as RNButton } from 'native-base'
import React, { useState } from 'react'
import Modal from 'react-native-modal';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { FONT_SIZE } from '../../utils/styles';
import { COLORS } from '../../utils/constants';
import SInfo from "react-native-sensitive-info";
import Button from '../Button';
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications';
import { StyleSheet } from 'react-native';

type Props = {
    isVisible: boolean;
    onClose: () => void;
}

export default function SeedPhraseModal({ isVisible, onClose }: Props) {
    const toast = useToast()

    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [seedPhrase, setSeedPhrase] = useState("")

    const showSeedPhrase = async () => {
        if (!password) {
            setError("Password cannot be empty")
            return
        }

        // verify password
        const _security = await SInfo.getItem("security", {
            sharedPreferencesName: "sern.android.storage",
            keychainService: "sern.ios.storage",
        });
        const security = JSON.parse(_security!)

        if (password !== security.password) {
            setError("Incorrect password!")
            return
        }

        // retrieve seed phrase
        const seedPhrase = await SInfo.getItem("mnemonic", {
            sharedPreferencesName: "sern.android.storage",
            keychainService: "sern.ios.storage",
        })

        setSeedPhrase(seedPhrase)
    }

    const handleInputChange = (value: string) => {
        setPassword(value)
        if (error) {
            setError("")
        }
    }

    const copySeedPhrase = () => {
        Clipboard.setString(seedPhrase)
        toast.show("Copied to clipboard", {
            type: 'success'
        })
    }

    const handleOnClose = () => {
        onClose()
        setSeedPhrase("")
        setPassword("")
    }

    return (
        <Modal isVisible={isVisible} animationIn="slideInRight" animationOut="slideOutLeft" onBackButtonPress={handleOnClose} onBackdropPress={handleOnClose}>
            <VStack bgColor="white" borderRadius="30" p="5" alignItems="center" space="4" w="full">
                <HStack alignItems="center" justifyContent="space-between" space="2" w="full">
                    <Text fontSize={1.1 * FONT_SIZE['xl']} bold>Show seed phrase</Text>
                    <Pressable onPress={handleOnClose} _pressed={{ opacity: 0.4 }}>
                        <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} color="black" />
                    </Pressable>
                </HStack>

                {seedPhrase ? (
                    <HStack alignItems="center" w="full" borderWidth="1" borderColor={COLORS.primary} borderRadius={10} p="4">
                        <Text fontSize={FONT_SIZE['lg']} w="90%" mr="2">{seedPhrase}</Text>
                        <Pressable onPress={copySeedPhrase} _pressed={{ opacity: 0.4 }}><Icon as={<Ionicons name="copy" />} size={5} color={COLORS.primary} /></Pressable>
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
                            onSubmitEditing={showSeedPhrase}
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
                    <Text fontSize={FONT_SIZE["md"]} mx="4">Never disclose this seed phrase. Anyone with your seed phrase can fully control all your accounts created with this seed phrase, including transferring away any of your funds.</Text>
                </HStack>

                {seedPhrase ? (
                    <Button text="Done" onPress={handleOnClose} />
                ) : (<HStack w="full" alignItems="center" justifyContent="space-between">
                    <RNButton py="4" bgColor="red.100" w="50%" onPress={handleOnClose} _pressed={{ backgroundColor: 'red.200' }}><Text color="red.400" bold fontSize="md">Cancel</Text></RNButton>
                    <Button text="Reveal" onPress={showSeedPhrase} style={{ width: "50%", borderRadius: 0 }} />
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