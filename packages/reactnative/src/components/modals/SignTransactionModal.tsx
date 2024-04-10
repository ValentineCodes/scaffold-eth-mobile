import { Button as RNButton, Divider, HStack, Text, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import useAccount from '../../hooks/scaffold-eth/useAccount'
import useNetwork from '../../hooks/scaffold-eth/useNetwork'
import { parseFloat, truncateAddress } from '../../utils/helperFunctions'
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles'
import Blockie from '../Blockie'
import Button from '../Button'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, Contract, ethers } from "ethers";
import useBalance from '../../hooks/scaffold-eth/useBalance'

type Props = {
    modal: {
        closeModal: () => void
        params: {
            contract: Contract
            contractAddress: string
            functionName: string
            args: any[]
            value: BigNumber
            gasLimit: BigNumber | number
            onConfirm: () => void
            onReject: () => void
        }
    }
}

interface GasCost {
    min: BigNumber | null
    max: BigNumber | null
}

export default function SignTransactionModal({ modal: { closeModal, params } }: Props) {
    const account = useAccount()
    const network = useNetwork()
    const { balance, isLoading: isLoadingBalance } = useBalance({ address: account.address })

    const [estimatedGasCost, setEstimatedGasCost] = useState<GasCost>({
        min: null,
        max: null
    })

    const estimateGasCost = async () => {
        const provider = new ethers.providers.JsonRpcProvider(network.provider)

        const gasEstimate = await params.contract.estimateGas[params.functionName](...params.args, {
            value: params.value,
            gasLimit: params.gasLimit
        })
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

    const calcTotal = () => {
        const minAmount = estimatedGasCost.min && parseFloat(ethers.utils.formatEther(params.value.add(estimatedGasCost.min)), 8).toString()
        const maxAmount = estimatedGasCost.max && parseFloat(ethers.utils.formatEther(params.value.add(estimatedGasCost.max)), 8).toString()
        return {
            min: minAmount,
            max: maxAmount
        }
    }

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider(network.provider)

        provider.off('block')

        provider.on('block', blockNumber => estimateGasCost())

        return () => {
            provider.off("block")
        }
    }, [])

    function confirm() {
        closeModal()
        params.onConfirm()
    }

    function reject() {
        closeModal()
        params.onReject()
    }

    return (
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
                    <Blockie address={params.contractAddress} size={1.8 * FONT_SIZE['xl']} />
                    <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{truncateAddress(params.contractAddress)}</Text>
                </HStack>
            </VStack>

            <HStack borderWidth="1" borderColor="muted.300" borderRadius="sm" alignSelf={"flex-start"} px={1.5} py={0.5}>
                <Text fontSize={"sm"} fontWeight={"medium"} color={"blue.500"}>{truncateAddress(params.contractAddress)}</Text>
                <Text fontSize={"sm"} fontWeight={"medium"}> : {params.functionName.toUpperCase()}</Text>
            </HStack>

            <Text fontSize={2 * FONT_SIZE["xl"]} bold textAlign="center">{ethers.utils.formatEther(params.value)} {network.currencySymbol}</Text>

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
                <RNButton py="4" bgColor="red.100" w="50%" onPress={reject} _pressed={{ background: 'red.200' }}><Text color="red.400" bold fontSize="md">Reject</Text></RNButton>
                <Button text="Confirm" onPress={confirm} style={{ width: "50%", borderRadius: 0 }} />
            </HStack>
        </VStack>
    )
}