import { HStack, Icon, Pressable, ScrollView, Text, View } from 'native-base'
import React from 'react'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/styles'
import { TransactionReceipt } from 'viem'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications'
import { COLORS } from '../../utils/constants'
import { displayTxResult } from '../../screens/Main/Tab/modules/debugContracts/contract/utilsDisplay'

type Props = {
    modal: {
        closeModal: (modal?: string, callback?: () => void) => void
        params: {
            txReceipt: string | number | bigint | Record<string, any> | TransactionReceipt | undefined
        }
    }
}

export default function TxReceiptModal({ modal: { closeModal, params } }: Props) {
    const toast = useToast()

    const copy = () => {
        Clipboard.setString(JSON.stringify(params.txReceipt))
        toast.show("Copied to clipboard", {
            type: "success"
        })
    }

    return (
        <View bgColor="white" borderRadius="30" p="5" w={WINDOW_WIDTH * 0.9} h={WINDOW_HEIGHT * 0.5}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <HStack alignItems={"center"} space={"1"}>
                    <Pressable onPress={copy}>
                        <Icon as={<Ionicons name="copy-outline" />} size={5} color={COLORS.primary} />
                    </Pressable>

                    <Text fontSize={"md"} fontWeight={"medium"}>Transaction Receipt</Text>
                </HStack>

                <Pressable onPress={() => closeModal()}>
                    <Icon as={<Ionicons name="close-outline" />} size={"xl"} color={"muted.400"} />
                </Pressable>
            </HStack>

            <ScrollView flex={1}>
                <Text my={"4"}>
                    {displayTxResult(params.txReceipt)}
                </Text>
            </ScrollView>
        </View>
    )
}