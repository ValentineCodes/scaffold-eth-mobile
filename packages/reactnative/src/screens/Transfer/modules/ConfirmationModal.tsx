import React, { useState } from 'react'
import Modal from "react-native-modal"
import { HStack, VStack, Text, Divider, Button as RNButton } from 'native-base'
import { FONT_SIZE } from '../../../utils/styles';
import { parseFloat, truncateAddress } from '../../../utils/helperFunctions';
import { useSelector, useDispatch } from 'react-redux';
import { Account } from '../../../store/reducers/Accounts';
import Blockie from '../../../components/Blockie'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { Network } from '../../../store/reducers/Networks';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, Wallet, ethers } from "ethers";

import Button from '../../../components/Button';

import SInfo from "react-native-sensitive-info"

import Success from '../../../components/modals/modules/Success'
import Fail from '../../../components/modals/modules/Fail'
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { addRecipient } from '../../../store/reducers/Recipients';

interface TxData {
    from: Account;
    to: string;
    amount: number;
    fromBalance: BigNumber | null;
}
type Props = {
    isVisible: boolean;
    onClose: () => void;
    txData: TxData;
    estimateGasCost: BigNumber | null;
}

export default function ConfirmationModal({ isVisible, onClose, txData, estimateGasCost }: Props) {
    const dispatch = useDispatch()

    const toast = useToast()

    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))

    const [isTransferring, setIsTransferring] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showFailModal, setShowFailModal] = useState(false)
    const [txReceipt, setTxReceipt] = useState<ethers.providers.TransactionReceipt | null>(null)

    const formatBalance = () => {
        return txData.fromBalance && Number(ethers.utils.formatEther(txData.fromBalance)) ? parseFloat(Number(ethers.utils.formatEther(txData.fromBalance)).toString(), 4) : 0
    }

    const calcTotal = () => {
        return estimateGasCost && parseFloat((txData.amount + Number(ethers.utils.formatEther(estimateGasCost))).toString(), 8)
    }

    const transfer = async () => {
        const accounts = await SInfo.getItem("accounts", {
            sharedPreferencesName: "sern.android.storage",
            keychainService: "sern.ios.storage",
        })

        const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address.toLowerCase() == txData.from.address.toLowerCase())

        const provider = new ethers.providers.JsonRpcProvider(connectedNetwork.provider)
        const wallet = new ethers.Wallet(activeAccount.privateKey).connect(provider)

        try {
            setIsTransferring(true)

            const tx = await wallet.sendTransaction({
                from: txData.from.address,
                to: txData.to,
                value: ethers.utils.parseEther(txData.amount.toString())
            })

            const txReceipt = await tx.wait(1)

            setTxReceipt(txReceipt)
            setShowSuccessModal(true)

            dispatch(addRecipient(txData.to))
        } catch (error) {
            setShowFailModal(true)
            return
        } finally {
            setIsTransferring(false)
        }
    }

    const viewTxDetails = async () => {
        if (!connectedNetwork.blockExplorer || !txReceipt) return

        try {
            await Linking.openURL(`${connectedNetwork.blockExplorer}/tx/${txReceipt.transactionHash}`)
        } catch (error) {
            toast.show("Cannot open url", {
                type: "danger"
            })
        }
    }

    return (
        <Modal isVisible={isVisible} animationIn="slideInUp" animationOut="zoomOut" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" p="5" space={4}>
                <VStack space="2">
                    <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">From:</Text>

                    <HStack alignItems="center" justifyContent="space-between" bgColor="#F5F5F5" borderRadius="10" p="2">
                        <HStack alignItems="center" space="2">
                            <Blockie address={txData.from.address} size={1.8 * FONT_SIZE['xl']} />

                            <VStack w="75%">
                                <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{txData.from.name}</Text>
                                <Text fontSize={FONT_SIZE['md']}>Balance: {formatBalance()} {connectedNetwork.currencySymbol}</Text>
                            </VStack>
                        </HStack>
                    </HStack>
                </VStack>

                <VStack space="2">
                    <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">To:</Text>

                    <HStack alignItems="center" space="2" bgColor="#F5F5F5" borderRadius="10" p="2">
                        <Blockie address={txData.to} size={1.8 * FONT_SIZE['xl']} />
                        <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{truncateAddress(txData.to)}</Text>
                    </HStack>
                </VStack>

                <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" textAlign="center" mb="-4">AMOUNT</Text>
                <Text fontSize={2 * FONT_SIZE["xl"]} bold textAlign="center">{txData.amount} {connectedNetwork.currencySymbol}</Text>

                <VStack borderWidth="1" borderColor="muted.300" borderRadius="10">
                    <HStack p="3" alignItems="flex-start" justifyContent="space-between">
                        <VStack>
                            <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">Estimated gas fee</Text>
                            <Text fontSize={FONT_SIZE['sm']} color="green.500">Likely in &lt; 30 second</Text>
                        </VStack>
                        <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" w="50%" textAlign="right">{estimateGasCost && parseFloat(ethers.utils.formatEther(estimateGasCost), 8)} {connectedNetwork.currencySymbol}</Text>
                    </HStack>

                    <Divider bgColor="muted.100" />

                    <HStack p="3" alignItems="flex-start" justifyContent="space-between">
                        <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">Total</Text>
                        <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" w="50%" textAlign="right">{calcTotal()} {connectedNetwork.currencySymbol}</Text>
                    </HStack>
                </VStack>

                <HStack w="full" alignItems="center" justifyContent="space-between">
                    <RNButton py="4" bgColor="red.100" w="50%" onPress={onClose} _pressed={{ background: 'red.200' }}><Text color="red.400" bold fontSize="md">Cancel</Text></RNButton>
                    <Button text="Confirm" loading={isTransferring} onPress={transfer} style={{ width: "50%", borderRadius: 0 }} />
                </HStack>
            </VStack>

            <Success isVisible={showSuccessModal} onClose={() => {
                setShowSuccessModal(false)
                onClose()
            }} onViewDetails={viewTxDetails} />

            <Fail isVisible={showFailModal} onClose={() => setShowFailModal(false)} onRetry={() => {
                setShowFailModal(false)
                transfer()
            }} />
        </Modal>
    )
}