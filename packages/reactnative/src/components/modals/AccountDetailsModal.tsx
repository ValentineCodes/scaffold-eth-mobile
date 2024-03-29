import React, { useState } from 'react'
import { Dimensions, StyleSheet } from "react-native"
import { Icon, Text, VStack, HStack, Button as RNButton } from 'native-base';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';

import { Account, removeAccount } from '../../store/reducers/Accounts';
import EditAccountNameForm from '../forms/EditAccountNameForm';
import CopyableText from '../CopyableText';
import Modal from "react-native-modal"
import Blockie from '../Blockie';
import { FONT_SIZE } from '../../utils/styles';
import Button from '../Button';
import PrivateKeyModal from './PrivateKeyModal';
import { TouchableOpacity } from 'react-native';


type Props = {
    isVisible: boolean;
    onClose: () => void;
}

export default function AccountDetailsModal({ isVisible, onClose }: Props) {

    const dispatch = useDispatch()

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [isEditingAccountName, setIsEditingAccountName] = useState(false)
    const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false)
    const [showRemoveAccountConsentModal, setShowRemoveAccountConsentModal] = useState(false)

    const handleOnClose = () => {
        if (isEditingAccountName) {
            setIsEditingAccountName(false)
        }
        onClose()

    }

    const handleAccountRemoval = () => {
        dispatch(removeAccount(connectedAccount.address))
        handleOnClose()
    }
    return (
        <Modal isVisible={isVisible} animationIn="slideInRight" animationOut="slideOutLeft" onBackButtonPress={handleOnClose} onBackdropPress={handleOnClose}>
            <VStack bgColor="white" borderRadius="30" p="5" alignItems="center" space="4" w="full">
                <Blockie address={connectedAccount.address} size={2.5 * FONT_SIZE['xl']} />
                {
                    isEditingAccountName ? <EditAccountNameForm close={() => setIsEditingAccountName(false)} /> : (
                        <TouchableOpacity activeOpacity={0.4} onPress={() => setIsEditingAccountName(true)}>
                            <VStack alignItems="center" space="2">
                                <HStack alignItems="center" space="2">
                                    <Text fontSize={FONT_SIZE['xl']} bold>{connectedAccount.name}</Text>
                                    <Icon as={<Ionicons name="create-outline" />} size={1.5 * FONT_SIZE['xl']} color="muted.400" />
                                </HStack>
                            </VStack>
                        </TouchableOpacity>
                    )
                }

                <QRCode value={connectedAccount.address} size={12 * FONT_SIZE['xl']} />

                <CopyableText value={connectedAccount.address} containerStyle={styles.addressContainer} textStyle={styles.addressText} />

                <Button type="outline" text="Show private key" onPress={() => setShowPrivateKeyModal(true)} />

                {accounts.length > 1 && <RNButton py="4" borderRadius={25} bgColor="red.100" w="full" onPress={() => setShowRemoveAccountConsentModal(true)}><Text color="red.400" bold fontSize="md">Remove account</Text></RNButton>}
            </VStack>

            {showPrivateKeyModal && <PrivateKeyModal isVisible={showPrivateKeyModal} onClose={() => setShowPrivateKeyModal(false)} />}

            {showRemoveAccountConsentModal && (
                <Modal isVisible={showRemoveAccountConsentModal} animationIn="zoomIn" animationOut="zoomOut" onBackButtonPress={() => setShowRemoveAccountConsentModal(false)} onBackdropPress={() => setShowRemoveAccountConsentModal(false)}>
                    <VStack bgColor="white" borderRadius="30" px="7" py="5" alignItems="center" space="4">
                        <Icon as={<Ionicons name="warning-outline" />} size={Dimensions.get("window").height * 0.17} color="red.400" />
                        <Text color="red.400" bold fontSize={1.5 * FONT_SIZE['xl']} textAlign="center">Remove account</Text>
                        <Text fontSize={FONT_SIZE['xl']} textAlign="center">This action cannot be reversed. Are you sure you want to go through with this?</Text>

                        <HStack w="full" mt="5" alignItems="center" justifyContent="space-between">
                            <RNButton py="4" bgColor="red.100" w="50%" onPress={() => setShowRemoveAccountConsentModal(false)}><Text color="red.400" bold fontSize="md">Not really</Text></RNButton>
                            <RNButton py="4" bgColor="red.400" w="50%" onPress={handleAccountRemoval}><Text color="white" bold fontSize="md">Yes, I'm sure</Text></RNButton>
                        </HStack>
                    </VStack>
                </Modal>
            )}
        </Modal>
    )
}

const styles = StyleSheet.create({
    addressContainer: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: "#F5F5F5",
        borderRadius: 25
    },
    addressText: {
        fontWeight: '500',
        fontSize: FONT_SIZE['xl'],
        width: "92%"
    }
})