import { useIsFocused, useNavigation } from '@react-navigation/native'
import { HStack, VStack, Icon, Text, Input, Divider, View, FlatList, Image, Pressable } from 'native-base'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { FONT_SIZE } from '../../utils/styles'
import { ALCHEMY_KEY, COLORS } from '../../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { Account } from '../../store/reducers/Accounts'
import { Network } from '../../store/reducers/Networks'
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5"
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import Button from '../../components/Button'
import Blockie from '../../components/Blockie'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, ethers } from "ethers";
import QRCodeScanner from '../../components/modals/QRCodeScanner'
import AccountsModal from './modules/AccountsModal'
import redstone from 'redstone-api';
import ConfirmationModal from './modules/ConfirmationModal'
import { useToast } from "react-native-toast-notifications"
import { isENS, parseFloat } from '../../utils/helperFunctions'
import ConsentModal from '../../components/modals/ConsentModal'
import { clearRecipients } from '../../store/reducers/Recipients'

type Props = {}

export default function Transfer({ }: Props) {
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const dispatch = useDispatch()

    const toast = useToast()

    const accounts: Account[] = useSelector((state: any) => state.accounts)
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))
    const connectedAccount: Account = useSelector((state: any) => state.accounts.find((account: Account) => account.isConnected))
    const recipients: string[] = useSelector((state: any) => state.recipients)

    const [balance, setBalance] = useState<BigNumber | null>(null)
    const [gasCost, setGasCost] = useState<BigNumber | null>(null)
    const [dollarRate, setDollarRate] = useState<number | null>(null)

    const [from, setFrom] = useState<Account>(connectedAccount)
    const [toAddress, setToAddress] = useState("")
    const [amount, setAmount] = useState("")
    const [showFromAccountsModal, setShowFromAccountsModal] = useState(false)
    const [showToAccountsModal, setShowToAccountsModal] = useState(false)
    const [showScanner, setShowScanner] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [showClearRecipientsConsentModal, setShowClearRecipientsConsentModal] = useState(false)
    const [toAddressError, setToAddressError] = useState("")
    const [amountError, setAmountError] = useState("")
    const [isAmountInCrypto, setIsAmountInCrypto] = useState(true)

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 13)}...${address.slice(address.length - 13, address.length)}`

    }

    const getBalance = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(connectedNetwork.provider)
            const balance = await provider.getBalance(from.address)
            const gasPrice = await provider.getGasPrice()

            const gasCost = gasPrice.mul(BigNumber.from(21000))

            // try {
            //     const price = await redstone.getPrice(connectedNetwork.currencySymbol);
            //     setDollarRate(price.value)
            // } catch (error) {
            //     setDollarRate(null)
            //     return
            // } finally {
            setGasCost(gasCost)
            setBalance(balance)
            // }

        } catch (error) {
            return
        }
    }

    const getAmountConversion = useCallback(() => {
        if (dollarRate === null || isNaN(Number(amount))) return

        if (isAmountInCrypto) {
            const dollarValue = Number(amount) * dollarRate
            return "$" + (dollarValue ? parseFloat(dollarValue.toString(), 8) : "0")
        } else {
            const dollarValue = Number(amount) / dollarRate
            return `${dollarValue ? parseFloat(dollarValue.toString(), 8) : "0"} ${connectedNetwork.currencySymbol}`
        }
    }, [dollarRate, amount, isAmountInCrypto])

    const confirm = () => {
        if (!ethers.utils.isAddress(toAddress)) {
            toast.show("Invalid address", {
                type: "danger"
            })
            return
        }

        let _amount = amount;

        if (!isAmountInCrypto) {
            if (dollarRate) {
                _amount = (Number(_amount) / dollarRate).toString()
            } else if (amountError) {
                setAmountError("")
            }
        }

        if (isNaN(Number(_amount)) || Number(_amount) < 0) {
            toast.show("Invalid amount", {
                type: 'danger'
            })
            return
        }

        if (_amount.trim() && balance && gasCost && !isNaN(Number(_amount))) {
            if (Number(_amount) >= Number(ethers.utils.formatEther(balance))) {
                toast.show("Insufficient amount", {
                    type: 'danger'
                })
                return
            } else if (Number(ethers.utils.formatEther(balance.sub(gasCost))) < Number(_amount)) {
                toast.show("Insufficient amount for gas", {
                    type: 'danger'
                })
                return
            }
        }

        setShowConfirmationModal(true)
    }

    const formatBalance = () => {
        return Number(ethers.utils.formatEther(balance!)) ? parseFloat(Number(ethers.utils.formatEther(balance!)).toString(), 4) : 0
    }

    const handleToAddressChange = async (value: string) => {
        setToAddress(value)

        if (toAddressError) {
            setToAddressError("")
        }

        if (isENS(value)) {
            try {
                const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`)

                const address = await provider.resolveName(value)

                if (ethers.utils.isAddress(address)) {
                    setToAddress(address)
                } else {
                    setToAddressError("Invalid ENS")
                }
            } catch (error) {
                setToAddressError("Could not resolve ENS")
                return
            }
        }
    }

    const handleAmountChange = (value: string) => {
        setAmount(value)

        let amount = Number(value);

        if (!isAmountInCrypto) {
            if (dollarRate) {
                amount = Number(amount) / dollarRate
            } else if (amountError) {
                setAmountError("")
            }
        }

        if (value.trim() && balance && !isNaN(amount) && gasCost) {
            if (amount >= Number(ethers.utils.formatEther(balance))) {
                setAmountError("Insufficient amount")
            } else if (Number(ethers.utils.formatEther(balance.sub(gasCost))) < amount) {
                setAmountError("Insufficient amount for gas")
            } else if (amountError) {
                setAmountError("")
            }
        } else if (amountError) {
            setAmountError("")
        }
    }

    const setMaxAmount = () => {
        if (balance && gasCost && balance.gt(gasCost)) {
            const max = ethers.utils.formatEther(balance.sub(gasCost))
            handleAmountChange(max)
            setIsAmountInCrypto(true)
        }
    }

    const convertCurrency = () => {
        // allow users to start from preferred currency
        if (!amount && dollarRate) {
            setIsAmountInCrypto(!isAmountInCrypto)
            return
        }

        // validate input
        if (!amount || !dollarRate) return
        if (isNaN(Number(amount)) || Number(amount) < 0) {
            toast.show("Invalid amount", {
                type: "danger"
            })
            return
        }

        setIsAmountInCrypto(!isAmountInCrypto)

        if (isAmountInCrypto) {
            setAmount((Number(amount) * dollarRate).toString())
        } else {
            setAmount((Number(amount) / dollarRate).toString())
        }
    }

    const getToAddressName = () => {
        const toAccount = accounts.find(account => account.address?.toLowerCase() === toAddress?.toLowerCase())

        if (!toAccount) return
        return `(${toAccount.name})`

    }

    const logo = useMemo(() => {
        let _logo = require("../../assets/images/eth-icon.png");

        if (["Polygon", "Mumbai"].includes(connectedNetwork.name)) {
            _logo = require("../../assets/images/polygon-icon.png")
        } else if (["Arbitrum", "Arbitrum Goerli"].includes(connectedNetwork.name)) {
            _logo = require("../../assets/images/arbitrum-icon.png")
        } else if (["Optimism", "Optimism Goerli"].includes(connectedNetwork.name)) {
            _logo = require("../../assets/images/optimism-icon.png")
        }

        return <Image key={`${_logo}`} source={_logo} alt={connectedNetwork.name} style={styles.networkLogo} />
    }, [connectedNetwork])

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.goBack()

        return true;
    });

    useEffect(() => {
        if (!isFocused) return
        const provider = new ethers.providers.JsonRpcProvider(connectedNetwork.provider)

        provider.off('block')

        provider.on('block', blockNumber => {
            getBalance()
        })

        return () => {
            provider.off("block")
            backHandler.remove();
        }
    }, [from])

    if (!isFocused) return

    return (
        <VStack flex="1" bgColor="white" p="15" space="6">
            <HStack alignItems="center" space={2}>
                <Pressable onPress={() => navigation.goBack()} _pressed={{ opacity: 0.4 }}>
                    <Icon as={<Ionicons name="arrow-back-outline" />} size={1.3 * FONT_SIZE['xl']} color="black" />
                </Pressable>
                <Text fontSize={1.2 * FONT_SIZE["xl"]} bold>Send {connectedNetwork.currencySymbol}</Text>
            </HStack>

            <VStack space="2">
                <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">From:</Text>

                <Pressable disabled={accounts.length === 1} onPress={() => setShowFromAccountsModal(true)}>
                    {({ isPressed }) => (
                        <>
                            <View style={styles.fromAccountContainer} bgColor={isPressed ? 'rgba(39, 184, 88, 0.2)' : '#f5f5f5'}>
                                <HStack alignItems="center" space="2">
                                    <Blockie address={from.address} size={1.8 * FONT_SIZE['xl']} />

                                    <VStack w="75%">
                                        <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{from.name}</Text>
                                        <Text fontSize={FONT_SIZE['md']}>Balance: {balance !== null && `${formatBalance()} ${connectedNetwork.currencySymbol}`}</Text>
                                    </VStack>
                                </HStack>

                                {accounts.length > 1 && <Icon as={<Ionicons name="chevron-down" />} size={1.1 * FONT_SIZE['xl']} color="black" mr="2" />}
                            </View>
                        </>
                    )}
                </Pressable>
            </VStack>

            <VStack space="2">
                <HStack alignItems="center" space="2">
                    <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">To:</Text>
                    <TouchableOpacity activeOpacity={0.4} style={{ width: '100%' }} onPress={() => {
                        if (accounts.length > 1) {
                            setShowToAccountsModal(true)
                        } else {
                            setToAddress(connectedAccount.address)
                        }
                    }}>
                        <Text color={COLORS.primary} fontWeight="medium" fontSize={FONT_SIZE['lg']} flex="1">My account<Text color="black">{getToAddressName()}</Text></Text>
                    </TouchableOpacity>
                </HStack>

                <Input
                    value={toAddress}
                    borderRadius="lg"
                    variant="filled"
                    fontSize="md"
                    focusOutlineColor={COLORS.primary}
                    InputLeftElement={ethers.utils.isAddress(toAddress) ? <View ml="2"><Blockie address={toAddress} size={1.8 * FONT_SIZE['xl']} /></View> : undefined}
                    InputRightElement={
                        <TouchableOpacity onPress={() => setShowScanner(true)} style={{ marginRight: 10 }}>
                            <Icon as={<MaterialCommunityIcons name="qrcode-scan" />} size={1.3 * FONT_SIZE['xl']} color={COLORS.primary} />
                        </TouchableOpacity>
                    }
                    placeholder="Recipient Address"
                    onChangeText={handleToAddressChange}
                    _input={{
                        selectionColor: COLORS.primary,
                        cursorColor: COLORS.primary,
                    }}
                    onSubmitEditing={confirm}
                />

                {toAddressError && <Text fontSize={FONT_SIZE['md']} color="red.400">{toAddressError}</Text>}
            </VStack>

            <VStack space="2">
                <HStack alignItems="center" space="2">
                    <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">Amount:</Text>
                    {balance && gasCost && balance.gte(gasCost) && <TouchableOpacity activeOpacity={0.4} onPress={setMaxAmount}><Text color={COLORS.primary} fontWeight="medium" fontSize={FONT_SIZE['lg']}>Max</Text></TouchableOpacity>}
                </HStack>

                <Input
                    value={amount}
                    borderRadius="lg"
                    variant="filled"
                    fontSize="lg"
                    focusOutlineColor={COLORS.primary}
                    placeholder={`0 ${isAmountInCrypto ? connectedNetwork.currencySymbol : "USD"}`}
                    onChangeText={handleAmountChange}
                    _input={{
                        selectionColor: COLORS.primary,
                        cursorColor: COLORS.primary,
                    }}
                    onSubmitEditing={confirm}
                    keyboardType='number-pad'
                    InputLeftElement={
                        <TouchableOpacity activeOpacity={0.4} onPress={convertCurrency} disabled={!Boolean(dollarRate)} style={{ marginLeft: 10 }}>
                            {isAmountInCrypto ?
                                logo
                                :
                                <Icon as={<FontAwesome5 name="dollar-sign" />} size={1.3 * FONT_SIZE['xl']} ml={3} color={COLORS.primary} />
                            }
                        </TouchableOpacity>}
                    InputRightElement={dollarRate !== null ? <Text fontSize={FONT_SIZE['lg']} color={COLORS.primary} mr="2">{getAmountConversion()}</Text> : undefined}
                />

                {amountError && <Text fontSize={FONT_SIZE['md']} color="red.400">{amountError}</Text>}
            </VStack>

            <Divider bgColor="muted.300" my="2" />

            <View flex="1">
                {
                    recipients.length > 0 && (
                        <>
                            <HStack alignItems="center" justifyContent="space-between" mb="4">
                                <Text bold fontSize={FONT_SIZE['xl']}>Recents</Text>
                                <TouchableOpacity activeOpacity={0.4} onPress={() => setShowClearRecipientsConsentModal(true)}>
                                    <Text color={COLORS.primary} fontSize={FONT_SIZE['lg']} fontWeight="medium">Clear</Text>
                                </TouchableOpacity>
                            </HStack>

                            <FlatList
                                keyExtractor={item => item}
                                data={recipients}
                                renderItem={({ item }) => (
                                    <TouchableOpacity activeOpacity={0.4} onPress={() => setToAddress(item)}>
                                        <HStack alignItems="center" space="4" mb="4">
                                            <Blockie address={item} size={1.7 * FONT_SIZE['xl']} />
                                            <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{truncateAddress(item)}</Text>
                                        </HStack>
                                    </TouchableOpacity>
                                )}
                            />
                        </>
                    )
                }
            </View>

            {showScanner && <QRCodeScanner isOpen={showScanner} onClose={() => setShowScanner(false)} onReadCode={address => {
                setToAddress(address)
                setShowScanner(false)
            }} />}

            <Button text="Next" onPress={confirm} />

            <ConsentModal
                isVisible={showClearRecipientsConsentModal}
                title="Clear Recents!"
                subTitle="This action cannot be reversed. Are you sure you want to go through with this?"
                okText="Yes, I'm sure"
                cancelText='Not really'
                onClose={() => setShowClearRecipientsConsentModal(false)}
                onAccept={() => {
                    setShowClearRecipientsConsentModal(false)
                    dispatch(clearRecipients())
                }}
            />

            {showConfirmationModal && (
                <ConfirmationModal
                    isVisible={showConfirmationModal}
                    onClose={() => setShowConfirmationModal(false)}
                    txData={{
                        from,
                        to: toAddress,
                        amount: !isAmountInCrypto && dollarRate ? parseFloat((Number(amount) / dollarRate).toString(), 8) : parseFloat(amount, 8),
                        fromBalance: balance
                    }}
                    estimateGasCost={gasCost}
                />
            )}

            <AccountsModal
                isVisible={showFromAccountsModal || showToAccountsModal}
                selectedAccount={showFromAccountsModal ? from.address : toAddress}
                onClose={() => {
                    if (showFromAccountsModal) {
                        setShowFromAccountsModal(false)
                    } else {
                        setShowToAccountsModal(false)
                    }
                }}
                onSelect={(account: Account) => {
                    if (showFromAccountsModal) {
                        if (account.address === from.address) return
                        setFrom(account)
                        setShowFromAccountsModal(false)
                    } else {
                        if (account.address === toAddress) return
                        setToAddress(account.address)
                        setShowToAccountsModal(false)
                    }
                }}
            />
        </VStack >
    )
}

const styles = StyleSheet.create({
    fromAccountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    networkLogo: {
        width: 2 * FONT_SIZE["xl"],
        height: 2 * FONT_SIZE["xl"],
    }
})