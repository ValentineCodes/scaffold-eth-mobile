import { HStack, Icon, Pressable, ScrollView, Text } from 'native-base'
import React from 'react'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/styles'
import { TransactionReceipt } from 'viem'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications'
import { COLORS } from '../../utils/constants'
import { displayTxResult } from '../contract/utilsDisplay'

type Props = {
    txReceipt: string | number | bigint | Record<string, any> | TransactionReceipt | undefined
}

export default function TxReceiptModal({ txReceipt }: Props) {
    const toast = useToast()

    const copy = () => {
        Clipboard.setString(JSON.stringify(txReceipt))
        toast.show("Copied to clipboard", {
            type: "success"
        })
    }

    return (
        <ScrollView bgColor="white" borderRadius="30" p="5" w={WINDOW_WIDTH * 0.9} maxHeight={WINDOW_HEIGHT * 0.5}>
            <HStack>
                <Pressable onPress={copy}>
                    <Icon as={<Ionicons name="copy-outline" />} size={5} color={COLORS.primary} />
                </Pressable>

                <Text fontSize={"md"} fontWeight={"medium"}>Transaction Receipt</Text>
            </HStack>
            <Text mb={"4"}>
                {displayTxResult(txReceipt)}
            </Text>
        </ScrollView>
    )
}