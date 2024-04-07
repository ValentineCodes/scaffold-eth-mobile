import { Divider, ScrollView, Text, VStack, View, HStack, Input, Image } from 'native-base'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import ProgressIndicatorHeader from '../../components/headers/ProgressIndicatorHeader'
import { COLORS } from '../../utils/constants'
import { FONT_SIZE } from '../../utils/styles'
import Modal from "react-native-modal";

import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../store/reducers/Auth'
import SInfo from "react-native-sensitive-info";
import { useToast } from 'react-native-toast-notifications'
import { shuffleArray } from '../../utils/helperFunctions'
import AccountsCountModal from '../../components/modals/AccountsCountModal'
import { initAccounts } from '../../store/reducers/Accounts'
import { importMnemonic } from 'react-native-web3-wallet'

type Props = {}

export default function ConfirmSeedPhrase({ }: Props) {
    const navigation = useNavigation()

    const dispatch = useDispatch()

    const toast = useToast();

    const [seedPhrase, setSeedPhrase] = useState<string[]>([])
    const [shuffledSeedPhrase, setShuffledSeedPhrase] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showAccountsCountModal, setShowAccountsCountModal] = useState(false)
    const [isConfirming, setIsConfirming] = useState(false)

    const isWordSelected = (word: string): boolean => {
        let _seedPhrase = seedPhrase.slice()

        return _seedPhrase.includes(word)
    }

    const handleWordSelection = (word: string) => {
        let _seedPhrase = seedPhrase.slice()

        if (isWordSelected(word)) {
            _seedPhrase = _seedPhrase.filter(el => el !== word)
        } else if (seedPhrase.length >= 12) {
            toast.show("Invalid seed phrase input", {
                type: "danger"
            })
            return
        } else {
            _seedPhrase.push(word)
        }

        setSeedPhrase(_seedPhrase)
    }

    const handleValueChange = (value: string, index: number) => {
        let _seedPhrase = seedPhrase.slice()

        _seedPhrase[index] = value.trim()
        setSeedPhrase(_seedPhrase)
    }

    const validateInput = async () => {
        if (seedPhrase.length !== 12) {
            toast.show("Please complete seed phrase", {
                type: "warning"
            })
            return
        }

        try {
            const _seedPhrase = await SInfo.getItem("mnemonic", {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            });
            const selectedSeedPhrase = seedPhrase.join(" ")

            if (_seedPhrase !== selectedSeedPhrase) {
                toast.show("Incorrect seed phrase order", {
                    type: "danger"
                })
                return
            }

            setShowAccountsCountModal(true)
        } catch (error) {
            toast.show("Failed to get mnemonic. Please try again.", {
                type: 'danger'
            })
        }
    }

    const confirm = async (accountsCount: number) => {
        try {
            setIsConfirming(true)
            const seedPhrase = await SInfo.getItem("mnemonic", {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            });

            let wallets = []

            for (let i = 0; i < accountsCount; i++) {
                const newWallet = await importMnemonic(seedPhrase, "", `m/44'/60'/0'/0/${i}`, true)
                wallets.push({
                    address: newWallet.address,
                    privateKey: newWallet.privateKey
                })
            }

            await SInfo.setItem("accounts", JSON.stringify(wallets), {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            })

            dispatch(initAccounts(wallets.map(wallet => ({ ...wallet, isImported: false }))))

            setShowSuccessModal(true)
        } catch (error) {
            toast.show("Failed to create wallet. Please ensure you have a stable network connection and try again.", {
                type: 'danger'
            })
        } finally {
            setIsConfirming(false)
        }
    }

    const handleSuccess = () => {
        setShowSuccessModal(false)
        dispatch(loginUser())
        navigation.navigate("Main")
    }

    useEffect(() => {
        (async () => {
            const seedPhrase = await SInfo.getItem("mnemonic", {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            });
            if (seedPhrase) {
                const _seedPhrase: string[] = seedPhrase.split(" ")
                const shuffledSeedPhrase = shuffleArray(_seedPhrase)
                setShuffledSeedPhrase(shuffledSeedPhrase)
                setIsLoading(false)
            }
        })()
    }, [])
    return (
        <View style={styles.container}>
            <ProgressIndicatorHeader progress={3} />

            <Divider bgColor="muted.100" mt="8" mb="4" />

            <ScrollView flex="1">
                <Text textAlign="center" color={COLORS.primary} fontSize={1.7 * FONT_SIZE['xl']} lineHeight="40" bold>Confirm Seed Phrase</Text>
                <Text textAlign="center" fontSize={FONT_SIZE["lg"]} my="2">Select each word in the order it was presented to you.</Text>

                <Divider bgColor="muted.100" my="4" />

                {isLoading ? <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : <ScrollView contentContainerStyle={styles.seedPhraseWrapper} style={styles.seedPhraseContainer}>
                    {shuffledSeedPhrase.map((word) => (
                        <TouchableOpacity activeOpacity={0.4} onPress={() => handleWordSelection(word)} style={{ width: '45%' }}>
                            <Text key={Math.random().toString()} style={[styles.word, { backgroundColor: isWordSelected(word) ? COLORS.primary : "#F5F5F5", color: isWordSelected(word) ? "white" : "black" }]}>{word}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>}


                <HStack my="10" w="full" justifyContent="space-between" alignItems="center">
                    {shuffledSeedPhrase.map((word, index) => <Divider key={word} w={`${100 / 15}%`} bgColor={index <= seedPhrase.filter(word => word && shuffledSeedPhrase.includes(word)).length - 1 ? COLORS.primary : "muted.200"} />)}
                </HStack>

                <HStack style={styles.seedPhraseInputContainer}>
                    {Array(12).fill(null).map((word, index) => <Input borderRadius="lg"
                        variant="filled"
                        fontSize="md"
                        w="32%"
                        mb="2"
                        value={seedPhrase[index]}
                        onChangeText={(value) => handleValueChange(value, index)}
                        InputLeftElement={<Text ml="2">{index + 1}.</Text>}
                        _input={{
                            selectionColor: COLORS.primary,
                            cursorColor: '#303030',
                        }}
                        focusOutlineColor={COLORS.primary}
                        onSubmitEditing={validateInput}
                    />)}
                </HStack>

                <Divider bgColor="muted.100" mt="4" mb="3" />

                <Button text="Confirm" style={{ backgroundColor: seedPhrase.length === 12 ? COLORS.primary : "#2A974D", marginBottom: 50 }} disabled={seedPhrase.length !== 12} loading={isConfirming} onPress={validateInput} />

                {showAccountsCountModal && <AccountsCountModal isVisible={showAccountsCountModal} onClose={() => setShowAccountsCountModal(false)} onFinish={(accountsCount: number) => {
                    confirm(accountsCount)
                    setShowAccountsCountModal(false)
                }} />}

                {/* Success modal */}
                <Modal isVisible={showSuccessModal} animationIn="zoomIn" animationOut="zoomOut" onBackdropPress={() => setShowSuccessModal(false)} onBackButtonPress={() => setShowSuccessModal(false)}>
                    <VStack bgColor="white" borderRadius="40" px="7" py="5" alignItems="center" space="4">
                        <Image source={require("../../assets/images/success_icon.png")} alt="Success!" style={{ width: Dimensions.get("window").height * 0.25, height: Dimensions.get("window").height * 0.25 }} />
                        <Text color={COLORS.primary} bold fontSize={1.5 * FONT_SIZE['xl']}>Successful!</Text>
                        <Text fontSize={FONT_SIZE['xl']} textAlign="center">You've successfully protected your wallet. Remember to keep your seed phrase safe. It's your responsibility!</Text>
                        <Text fontSize={FONT_SIZE['xl']} textAlign="center">Scaffold-ETH cannot recover your wallet should you lose it.</Text>
                        <Button text="Ok" onPress={handleSuccess} />
                    </VStack>
                </Modal>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 15
    },
    loader: {
        height: 280,
        justifyContent: 'center',
        alignItems: "center",
    },
    seedPhraseContainer: {
        width: '100%',
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 40,
        padding: 15
    },
    seedPhraseWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    word: {
        padding: 10,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 10,
        borderRadius: 25
    },
    seedPhraseInputContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    }
})