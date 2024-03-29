import { Divider, FlatList, HStack, Icon, Text, VStack, Pressable } from 'native-base';
import React from 'react'
import { ActiveSession, switchSessionAccount } from '../../store/reducers/ActiveSessions';
import { useDispatch, useSelector } from 'react-redux';
import { web3wallet } from '../../utils/Web3WalletClient';
import { SessionTypes } from '@walletconnect/types';
import { useToast } from 'react-native-toast-notifications';
import { Account } from '../../store/reducers/Accounts';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { FONT_SIZE } from '../../utils/styles';
import Modal from "react-native-modal"

type Props = {
    isVisible: boolean;
    onClose: () => void;
}

export default function SwitchAccountModal({ isVisible, onClose }: Props) {
    const activeSessions: ActiveSession[] = useSelector(state => state.activeSessions)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const toast = useToast()

    const dispatch = useDispatch()

    const sessions = activeSessions.filter(session => session.account !== connectedAccount.address)

    const switchAccount = async (session: ActiveSession) => {
        const newNamespaces: SessionTypes.Namespaces = {}
        let accounts: string[] = []
        Object.keys(session.requiredNamespaces).forEach(key => {
            session.requiredNamespaces[key].chains.forEach(chain => {
                accounts.push(`${chain}:${connectedAccount.address}`);
            });

            newNamespaces[key] = {
                accounts,
                methods: session.requiredNamespaces[key].methods,
                events: session.requiredNamespaces[key].events
            }
        })

        try {
            await web3wallet.updateSession({
                topic: session.topic,
                namespaces: newNamespaces
            })

            const sessionUpdate = {
                site: session.site,
                account: connectedAccount.address
            }

            dispatch(switchSessionAccount(sessionUpdate))

            if (sessions.length === 1) {
                onClose()
            }
        } catch (error) {
            toast.show("Failed to switch network", {
                type: "danger"
            })
        }
    }

    const switchAll = async () => {
        for (let i = 0; i < sessions.length; i++) {
            try {
                await switchAccount(sessions[i])
            } catch (error) {
                continue
            }
        }
    }

    return (
        <Modal isVisible={isVisible} animationIn="slideInRight" animationOut="slideOutLeft" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" p="5" space={2} maxH="50%">
                <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['xl']} bold>Switch account</Text>
                    <Pressable onPress={onClose} _pressed={{ opacity: 0.4 }}>
                        <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} />
                    </Pressable>
                </HStack>

                <Divider bgColor="muted.300" my="2" />

                {sessions.length > 1 && <Pressable _pressed={{ opacity: 0.4 }}><Text color="blue.400" fontWeight="semibold" fontSize={FONT_SIZE['lg']} textAlign="right" onPress={switchAll}>Switch all</Text></Pressable>}
                <FlatList
                    data={sessions}
                    keyExtractor={item => item.site}
                    renderItem={({ item }) => (
                        <HStack space={4} py="2" alignItems="center" justifyContent="space-between">
                            <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" w="70%">{item.site}</Text>
                            <Pressable onPress={() => switchAccount(item)} _pressed={{ opacity: 0.4 }}><Text color="blue.500" fontWeight="semibold" fontSize={FONT_SIZE['lg']}>Switch</Text></Pressable>
                        </HStack>
                    )}
                    ItemSeparatorComponent={<Divider bgColor="muted.100" my="2" />}
                />
            </VStack>
        </Modal>
    )
}