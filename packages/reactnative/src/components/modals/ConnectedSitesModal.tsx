import { HStack, Text, VStack, Icon, Divider } from 'native-base';
import React from 'react'
import { Pressable, FlatList } from 'react-native';
import { ConnectedSite, removeConnectedSite } from '../../store/reducers/ConnectedSites';
import { useDispatch, useSelector } from 'react-redux';
import { web3wallet } from '../../utils/Web3WalletClient';
import { getSdkError } from '@walletconnect/utils';
import { removeSession } from '../../store/reducers/ActiveSessions';
import Modal from "react-native-modal"
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { FONT_SIZE } from '../../utils/styles';
import { Account } from '../../store/reducers/Accounts';

type Props = {
    isVisible: boolean;
    onClose: () => void;
}

export default function ConnectedSitesModal({ isVisible, onClose }: Props) {
    const dispatch = useDispatch()

    const connectedSites: ConnectedSite[] = useSelector(state => state.connectedSites)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const disconnectSession = async (site: ConnectedSite) => {
        dispatch(removeConnectedSite(site.name))
        dispatch(removeSession(site.name))
        if (connectedSites.length === 1) {
            onClose()
        }
        try {
            await web3wallet.disconnectSession({
                topic: site.topic,
                reason: getSdkError("USER_DISCONNECTED")
            })
        } catch (error) {
            return
        }
    }
    return (
        <Modal isVisible={isVisible} animationIn="slideInRight" animationOut="slideOutLeft" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" p="5" space={2} maxH="50%">
                <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['xl']} bold>Connected sites</Text>
                    <Pressable onPress={onClose} _pressed={{ opacity: 0.4 }}>
                        <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} />
                    </Pressable>
                </HStack>
                <Text fontSize={1.1 * FONT_SIZE['md']}>{connectedAccount.name} is connected to these sites. They can view your account address.</Text>

                <Divider bgColor="muted.300" my="2" />

                {connectedSites.length === 0 ? (
                    <Text textAlign="center" fontSize={FONT_SIZE['lg']}>No connected sites</Text>
                ) : (
                    <FlatList
                        keyExtractor={item => item.name}
                        data={connectedSites}
                        renderItem={({ item }) => (
                            <HStack space={4} py="2" alignItems="center" justifyContent="space-between">
                                <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" w="60%">{item.name}</Text>
                                <Pressable onPress={() => disconnectSession(item)} _pressed={{ opacity: 0.4 }}>
                                    <Text color="blue.500" fontWeight="semibold" fontSize={FONT_SIZE['lg']}>Disconnect</Text>
                                </Pressable>
                            </HStack>
                        )}
                        ItemSeparatorComponent={<Divider bgColor="muted.100" my="2" />}
                    />
                )}
            </VStack>
        </Modal>
    )
}