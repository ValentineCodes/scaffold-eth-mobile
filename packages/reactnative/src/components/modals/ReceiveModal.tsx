import React from 'react'
import Modal from "react-native-modal"
import { Text, VStack, Icon, HStack, Divider, Pressable, View } from 'native-base'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { FONT_SIZE } from '../../utils/styles';
import { useSelector } from 'react-redux';
import { Account } from '../../store/reducers/Accounts';
import { Network } from '../../store/reducers/Networks';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../../utils/constants';
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications';
import Share from 'react-native-share';

type Props = {
    isVisible: boolean;
    onClose: () => void;
}

export default function ReceiveModal({ isVisible, onClose }: Props) {
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))

    const toast = useToast()

    const copyAddress = () => {
        Clipboard.setString(connectedAccount.address)
        toast.show("Copied to clipboard", {
            type: 'success'
        })
    }

    const shareAddress = async () => {
        try {
            await Share.open({ message: connectedAccount.address })
        } catch (error) {
            return
        }
    }

    return (
        <Modal isVisible={isVisible} animationIn="slideInUp" animationOut="slideOutDown" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" p="5" space={4} alignItems="center">
                <HStack alignItems="center" justifyContent="space-between" w="full">
                    <Text fontSize={FONT_SIZE['xl']} bold>Receive {connectedNetwork.currencySymbol}</Text>
                    <Pressable onPress={onClose} _pressed={{ opacity: 0.4 }}>
                        <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} />
                    </Pressable>
                </HStack>

                <Divider bgColor="muted.100" />

                <QRCode value={connectedAccount.address} size={12 * FONT_SIZE['xl']} />

                <Text fontSize={FONT_SIZE['xl']} fontWeight="medium" textAlign="center">{connectedAccount.address}</Text>

                <Divider bgColor="muted.100" />

                <Text fontSize={FONT_SIZE['md']} textAlign="center">Send only {connectedNetwork.name} ({connectedNetwork.currencySymbol}) to this address. Sending any other coins may result in permanent loss.</Text>

                <HStack alignItems="center" space="10" mt="5">
                    <Pressable alignItems="center" onPress={copyAddress}>
                        {({ isPressed }) => (
                            <>
                                <View bgColor={isPressed ? 'rgba(39, 184, 88, 0.2)' : COLORS.primaryLight} p="4" borderRadius="full">
                                    <Icon as={<Ionicons name="reader" />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
                                </View>
                                <Text fontSize={FONT_SIZE["lg"]} bold mt="2">Copy</Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable alignItems="center" onPress={shareAddress}>
                        {({ isPressed }) => (
                            <>
                                <View bgColor={isPressed ? 'rgba(39, 184, 88, 0.2)' : COLORS.primaryLight} p="4" borderRadius="full">
                                    <Icon as={<Ionicons name="paper-plane" />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
                                </View>
                                <Text fontSize={FONT_SIZE["lg"]} bold mt="2">Share</Text>
                            </>
                        )}
                    </Pressable>
                </HStack>
            </VStack>
        </Modal>
    )
}