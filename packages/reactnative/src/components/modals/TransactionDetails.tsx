import React from 'react'
import { Text, VStack, Icon, HStack, Divider, Pressable } from 'native-base'
import { useSelector } from 'react-redux';
import { Account } from '../../store/reducers/Accounts';
import { Network } from '../../store/reducers/Networks';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, ethers } from "ethers";
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import Modal from "react-native-modal"
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { FONT_SIZE } from '../../utils/styles';
import { parseFloat, truncateAddress } from '../../utils/helperFunctions';
import { COLORS } from '../../utils/constants';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    tx: any;
}

export default function TransactionDetails({ isVisible, onClose, tx }: Props) {
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))

    const toast = useToast()

    const renderAction = () => {
        if (tx.functionName === '') {
            if (tx.from.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Transfer `
            }
            if (tx.to.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Receive`
            }
        }

        return "Contract Interaction"
    }

    const renderTimestamp = () => {
        const MONTHS = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];

        const d = new Date(Number(tx.timeStamp) * 1000)

        let hour = d.getHours();
        let minutes = d.getMinutes();
        let day = d.getDate();
        let monthIndex = d.getMonth();
        let year = d.getFullYear();

        const currentYear = (new Date()).getFullYear()

        return `${MONTHS[monthIndex]} ${day}${year !== currentYear ? `, ${year}` : ""} at ${hour}:${minutes}${hour >= 0 && hour < 12 ? ' am' : ' pm'}`
    }

    const calcGasFee = () => {
        const estimatedGasFee = BigNumber.from(tx.gasUsed).mul(BigNumber.from(tx.gasPrice))
        return parseFloat(Number(ethers.utils.formatEther(estimatedGasFee)).toString(), 5)
    }

    const calcTotalAmount = () => {
        const estimatedGasFee = BigNumber.from(tx.gasUsed).mul(BigNumber.from(tx.gasPrice))

        return parseFloat(Number(ethers.utils.formatEther(estimatedGasFee.add(tx.value))).toString(), 5)
    }

    const viewOnBlockExplorer = async () => {
        if (!connectedNetwork.blockExplorer) return

        try {
            await Linking.openURL(`${connectedNetwork.blockExplorer}/tx/${tx.hash}`)
        } catch (error) {
            toast.show("Cannot open url", {
                type: "danger"
            })
        }
    }

    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="20" p="5" space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['xl']} bold>{renderAction()}</Text>
                    <Pressable onPress={onClose} _pressed={{ opacity: 0.4 }}>
                        <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} />
                    </Pressable>
                </HStack>

                <Divider bgColor="muted.300" my="2" />

                <HStack alignItems="center" justifyContent="space-between">
                    <VStack>
                        <Text fontSize={FONT_SIZE['sm']}>From</Text>
                        <Text fontSize={FONT_SIZE['md']} fontWeight="medium">{truncateAddress(tx.from)}</Text>
                    </VStack>

                    <VStack alignItems="flex-end">
                        <Text fontSize={FONT_SIZE['sm']}>To</Text>
                        <Text fontSize={FONT_SIZE['md']} fontWeight="medium">{truncateAddress(tx.to || tx.contractAddress)}</Text>
                    </VStack>
                </HStack>

                <Divider bgColor="muted.300" my="2" />

                <HStack alignItems="center" justifyContent="space-between">
                    <VStack>
                        <Text fontSize={FONT_SIZE['sm']}>Nonce</Text>
                        <Text fontSize={FONT_SIZE['md']} fontWeight="medium">#{tx.nonce}</Text>
                    </VStack>

                    <VStack alignItems="flex-end">
                        <Text fontSize={FONT_SIZE['sm']}>Date</Text>
                        <Text fontSize={FONT_SIZE['md']} fontWeight="medium">{renderTimestamp()}</Text>
                    </VStack>
                </HStack>

                <VStack borderWidth={0.5} mt="5" borderRadius={10} p="5" space={2}>
                    <HStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={FONT_SIZE['md']}>Amount</Text>
                        <Text fontSize={FONT_SIZE['md']}>{parseFloat(ethers.utils.formatEther(BigNumber.from(tx.value)), 5)} {connectedNetwork.currencySymbol}</Text>
                    </HStack>

                    <HStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={FONT_SIZE['md']}>Estimated gas fee</Text>
                        <Text fontSize={FONT_SIZE['md']}>{calcGasFee()} {connectedNetwork.currencySymbol}</Text>
                    </HStack>

                    <Divider bgColor="muted.300" my="2" />

                    <HStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={FONT_SIZE['md']} bold>Total amount</Text>
                        <Text fontSize={FONT_SIZE['md']} bold>{calcTotalAmount()} {connectedNetwork.currencySymbol}</Text>
                    </HStack>
                </VStack>

                {connectedNetwork.blockExplorer && <Pressable onPress={viewOnBlockExplorer} _pressed={{ opacity: 0.4 }}><Text textAlign="center" mt="2" fontSize={FONT_SIZE['lg']} fontWeight="semibold" color={COLORS.primary}>View on block explorer</Text></Pressable>}
            </VStack>
        </Modal>
    )
}