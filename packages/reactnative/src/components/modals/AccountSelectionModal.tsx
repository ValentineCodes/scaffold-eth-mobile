import React, { useState } from 'react'
import { Text, HStack, VStack, Icon, Divider, Pressable, FlatList } from 'native-base';
import { useSelector } from 'react-redux';
import { Account } from '../../store/reducers/Accounts';
import { truncateAddress } from '../../utils/helperFunctions';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Modal from "react-native-modal"
import { FONT_SIZE } from '../../utils/styles';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Button from "../Button"
import { Dimensions } from 'react-native';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onSelect: ((selectedAccounts: string) => void)
}

export default function AccountSelectionModal({ isVisible, onClose, onSelect }: Props) {
    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [selectedAccount, setSelectedAccount] = useState(connectedAccount.address)

    const isAccountSelected = (account: string) => {
        return selectedAccount === account
    }

    const handleSelection = (account: string) => {
        if (!isAccountSelected(account)) {
            setSelectedAccount(account)
        }
    }

    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" p="5" space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['xl']} bold>Select account to connect with</Text>
                    <Pressable onPress={onClose} _pressed={{ opacity: 0.4 }}>
                        <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} />
                    </Pressable>
                </HStack>

                <Divider bgColor="muted.300" mt="2" />

                <FlatList
                    keyExtractor={item => item.address}
                    data={accounts}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleSelection(item.address)}>
                            <HStack alignItems="center" py="5" space={2}>
                                <BouncyCheckbox disableBuiltInState isChecked={isAccountSelected(item.address)} fillColor='blue' onPress={(isChecked) => handleSelection(item.address)} />
                                <Text>{item.name}({truncateAddress(item.address)})</Text>
                            </HStack>
                        </Pressable>
                    )}
                    ItemSeparatorComponent={<Divider bgColor="muted.100" />}
                    h={Dimensions.get("window").height / 4.5}
                />

                <HStack w="full" mt="5" alignItems="center" justifyContent="space-between">
                    <Button type="outline" text="Cancel" onPress={onClose} style={{ width: "50%", borderRadius: 0 }} />
                    <Button text="Next" onPress={() => onSelect(selectedAccount)} style={{ width: "50%", borderRadius: 0 }} />
                </HStack>
            </VStack>
        </Modal>
    )
}