import { VStack, HStack, Icon, Divider, ScrollView, Text } from 'native-base';
import React from 'react'
import Modal from "react-native-modal"
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { FONT_SIZE } from '../../../utils/styles';
import { truncateAddress } from '../../../utils/helperFunctions';
import { useSelector } from 'react-redux';
import { Account } from '../../../store/reducers/Accounts';
import Blockie from '../../../components/Blockie'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { Dimensions, TouchableOpacity } from 'react-native';

import { COLORS } from '../../../utils/constants';


type Props = {
    isVisible: boolean;
    selectedAccount: string;
    onClose: () => void;
    onSelect: (account: Account) => void;
}

export default function AccountsModal({ isVisible, selectedAccount, onClose, onSelect }: Props) {
    const accounts: Account[] = useSelector(state => state.accounts)

    return (
        <Modal isVisible={isVisible} animationIn="slideInDown" animationOut="slideOutUp" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" p="5" space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['xl']} bold>Accounts</Text>
                    <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} onPress={onClose} />
                </HStack>

                <Divider bgColor="muted.300" mt="2" />

                <ScrollView maxH={Dimensions.get("window").height / 4.8}>
                    {accounts.map((account, index) => (
                        <TouchableOpacity key={account.address} activeOpacity={0.4} onPress={() => onSelect(account)}>
                            <HStack alignItems="center" justifyContent="space-between" paddingY={3} borderBottomWidth={index === accounts.length - 1 ? 0 : 1} borderBottomColor="muted.300">
                                <HStack alignItems="center" space={4}>
                                    <Blockie address={account.address} size={1.7 * FONT_SIZE["xl"]} />
                                    <VStack>
                                        <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">{account.name}</Text>
                                        <Text>{truncateAddress(account.address)}</Text>
                                    </VStack>
                                </HStack>
                                {selectedAccount === account.address && <Icon as={<Ionicons name="checkmark-done" />} color={COLORS.primary} size={1.2 * FONT_SIZE['xl']} />}
                            </HStack>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </VStack>
        </Modal>
    )
}