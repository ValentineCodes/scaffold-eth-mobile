import React, { useEffect, useState } from 'react'
import { HStack, VStack, Text, Divider, Button as RNButton } from 'native-base'
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import { parseFloat, truncateAddress } from '../../utils/helperFunctions';
import { useDispatch } from 'react-redux';
import { Account } from '../../store/reducers/Accounts';
import Blockie from '../../components/Blockie'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, Wallet, ethers } from "ethers";

import Button from '../../components/Button';

import SInfo from "react-native-sensitive-info"
import { getProviderWithName, Providers } from '../../utils/providers';

import Success from './modules/Success'
import Fail from './modules/Fail'
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { addRecipient } from '../../store/reducers/Recipients';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { Address } from 'viem';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useAccount from '../../hooks/scaffold-eth/useAccount';

type Props = {
    modal: {
        closeModal: () => void
        params: {
            from: Account;
            to: Address;
            value: BigNumber;
        }
    }
}

interface GasCost {
    min: BigNumber | null
    max: BigNumber | null
}

export default function SignTransferModal({ modal: { closeModal, params } }: Props) {
    const { from, to, value } = params

    const dispatch = useDispatch()

    const toast = useToast()

    const network = useNetwork()
    const account = useAccount()

    const { balance } = useBalance({ address: from.address })

    const [isTransferring, setIsTransferring] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showFailModal, setShowFailModal] = useState(false)
    const [txReceipt, setTxReceipt] = useState<ethers.providers.TransactionReceipt | null>(null)
    const [estimatedGasCost, setEstimatedGasCost] = useState<GasCost>({
        min: null,
        max: null
    })

    const calcTotal = () => {
        const minAmount = estimatedGasCost.min && parseFloat(ethers.utils.formatEther(value.add(estimatedGasCost.min)), 8).toString()
        const maxAmount = estimatedGasCost.max && parseFloat(ethers.utils.formatEther(value.add(estimatedGasCost.max)), 8).toString()
        return {
            min: minAmount,
            max: maxAmount
        }
    }

    const transfer = async () => {
        const accounts = await SInfo.getItem("accounts", {
            sharedPreferencesName: "sern.android.storage",
            keychainService: "sern.ios.storage",
        })

        const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address.toLowerCase() == from.address.toLowerCase())

        const provider = getProviderWithName(network.name.toLowerCase() as keyof Providers)
        const wallet = new ethers.Wallet(activeAccount.privateKey).connect(provider)

        try {
            setIsTransferring(true)

            const tx = await wallet.sendTransaction({
                from: from.address,
                to: to,
                value: ethers.utils.parseEther(value.toString())
            })

            const txReceipt = await tx.wait(1)

            setTxReceipt(txReceipt)
            setShowSuccessModal(true)

            dispatch(addRecipient(to))
        } catch (error) {
            setShowFailModal(true)
            return
        } finally {
            setIsTransferring(false)
        }
    }

    const viewTxDetails = async () => {
        if (!network.blockExplorer || !txReceipt) return

        try {
            await Linking.openURL(`${network.blockExplorer}/tx/${txReceipt.transactionHash}`)
        } catch (error) {
            toast.show("Cannot open url", {
                type: "danger"
            })
        }
    }

    const estimateGasCost = async () => {
        const provider = new ethers.providers.JsonRpcProvider(network.provider)

        const gasPrice = await provider.getGasPrice()

        const gasEstimate = gasPrice.mul(BigNumber.from(21000))

        const feeData = await provider.getFeeData()

        const gasCost: GasCost = {
            min: null,
            max: null
        }

        if (feeData.gasPrice) {
            gasCost.min = gasEstimate.mul(feeData.gasPrice)
        }

        if (feeData.maxFeePerGas) {
            gasCost.max = gasEstimate.mul(feeData.maxFeePerGas)
        }

        setEstimatedGasCost(gasCost)
    }

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider(network.provider)

        provider.off('block')

        provider.on('block', blockNumber => estimateGasCost())

        return () => {
            provider.off("block")
        }
    }, [])

    return (
        <>
            <VStack bgColor="white" borderRadius="30" p="5" space={4} w={WINDOW_WIDTH * 0.9}>
                <VStack space="2">
                    <Text textAlign={"right"} fontSize={"md"} fontWeight={"medium"}>{network.name} network</Text>
                    <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">From:</Text>

                    <HStack alignItems="center" justifyContent="space-between" bgColor="#F5F5F5" borderRadius="10" p="2">
                        <HStack alignItems="center" space="2">
                            <Blockie address={account.address} size={1.8 * FONT_SIZE['xl']} />

                            <VStack w="75%">
                                <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{account.name}</Text>
                                <Text fontSize={FONT_SIZE['md']}>Balance: {balance && `${balance} ${network.currencySymbol}`}</Text>
                            </VStack>
                        </HStack>
                    </HStack>
                </VStack>

                <VStack space="2">
                    <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">To:</Text>

                    <HStack alignItems="center" space="2" bgColor="#F5F5F5" borderRadius="10" p="2">
                        <Blockie address={to} size={1.8 * FONT_SIZE['xl']} />
                        <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{truncateAddress(to)}</Text>
                    </HStack>
                </VStack>

                <Text fontSize={2 * FONT_SIZE["xl"]} bold textAlign="center">{ethers.utils.formatEther(value)} {network.currencySymbol}</Text>

                <VStack borderWidth="1" borderColor="muted.300" borderRadius="10">
                    <HStack p="3" alignItems="flex-start" justifyContent="space-between">
                        <VStack>
                            <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">Estimated gas fee</Text>
                            <Text fontSize={FONT_SIZE['sm']} color="green.500">Likely in &lt; 30 second</Text>
                        </VStack>

                        <VStack w="50%">
                            <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" textAlign="right">{estimatedGasCost.min && parseFloat(ethers.utils.formatEther(estimatedGasCost.min), 8)} {network.currencySymbol}</Text>
                            <Text fontSize={FONT_SIZE['md']} fontWeight={"semibold"} textAlign="right" color={"muted.500"}>Max fee:</Text>
                            <Text fontSize={FONT_SIZE['md']} textAlign="right">{estimatedGasCost.max && parseFloat(ethers.utils.formatEther(estimatedGasCost.max), 8)} {network.currencySymbol}</Text>
                        </VStack>
                    </HStack>

                    <Divider bgColor="muted.100" />

                    <HStack p="3" alignItems="flex-start" justifyContent="space-between">
                        <VStack>
                            <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">Total:</Text>
                            <Text fontSize={FONT_SIZE['sm']} color="green.500">Amount + gas fee</Text>
                        </VStack>

                        <VStack w="50%">
                            <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" textAlign="right">{calcTotal().min} {network.currencySymbol}</Text>
                            <Text fontSize={FONT_SIZE['md']} fontWeight={"semibold"} textAlign="right" color={"muted.500"}>Max amount:</Text>
                            <Text fontSize={FONT_SIZE['md']} textAlign="right">{calcTotal().max} {network.currencySymbol}</Text>
                        </VStack>
                    </HStack>
                </VStack>

                <HStack w="full" alignItems="center" justifyContent="space-between">
                    <RNButton py="4" bgColor="red.100" w="50%" onPress={() => closeModal} _pressed={{ background: 'red.200' }}><Text color="red.400" bold fontSize="md">Reject</Text></RNButton>
                    <Button text="Confirm" onPress={transfer} style={{ width: "50%", borderRadius: 0 }} />
                </HStack>
            </VStack>

            <Success isVisible={showSuccessModal} onClose={() => {
                setShowSuccessModal(false)
                closeModal()
            }} onViewDetails={viewTxDetails} />

            <Fail isVisible={showFailModal} onClose={() => setShowFailModal(false)} onRetry={() => {
                setShowFailModal(false)
                transfer()
            }} />
        </>
    )
}