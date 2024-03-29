import React, { useState } from 'react'
import { HStack, Text, Icon, Pressable, View, VStack } from 'native-base';
import { useSelector } from 'react-redux';
import { Account } from '../store/reducers/Accounts';
import { Network } from '../store/reducers/Networks';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, ethers } from "ethers";
import TransactionDetails from './modals/TransactionDetails';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { COLORS } from '../utils/constants';
import { FONT_SIZE } from '../utils/styles';
import { truncateAddress, parseFloat } from '../utils/helperFunctions';

type Props = {
    tx: any;
}

export default function Transaction({ tx }: Props) {
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))

    const [showTxDetails, setShowTxDetails] = useState(false)

    const renderAction = () => {
        if (tx.functionName === '') {
            if (tx.from.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Transfer`
            }
            if (tx.to.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Receive`
            }
        }

        return "Contract Interaction"
    }

    const renderActionIcon = () => {
        let icon = "sync";

        if (renderAction() === 'Transfer') {
            icon = "paper-plane"
        }
        else if (renderAction() === "Receive") {
            icon = "download"
        }

        return (
            <View bgColor={COLORS.primaryLight} p="3" borderRadius="full">
                <Icon as={<Ionicons name={icon} />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
            </View>
        )
    }

    const renderAddress = () => {
        let address = `Address: ${truncateAddress(tx.to || tx.contractAddress)}`

        if (renderAction() === 'Transfer') {
            address = `To: ${truncateAddress(tx.to || tx.contractAddress)}`
        }
        else if (renderAction() === "Receive") {
            address = `From: ${truncateAddress(tx.from)}`
        }

        return (
            <Text fontSize={FONT_SIZE['md']}>{address}</Text>
        )
    }

    return (
        <Pressable onPress={() => setShowTxDetails(true)} _pressed={{ backgroundColor: 'rgba(39, 184, 88, 0.2)' }}>
            <HStack justifyContent="space-between" alignItems="center" py="2">
                <HStack alignItems="center" space={4}>
                    {renderActionIcon()}

                    <VStack>
                        <Text fontSize={FONT_SIZE['xl']} bold>{renderAction()}</Text>
                        {renderAddress()}
                    </VStack>

                </HStack>

                <Text fontSize={FONT_SIZE['lg']} bold>{Number(ethers.utils.formatEther(BigNumber.from(tx.value))) ? parseFloat(Number(ethers.utils.formatEther(BigNumber.from(tx.value))).toString(), 4) : 0} {connectedNetwork.currencySymbol}</Text>
            </HStack>

            <TransactionDetails isVisible={showTxDetails} onClose={() => setShowTxDetails(false)} tx={tx} />
        </Pressable>
    )
}