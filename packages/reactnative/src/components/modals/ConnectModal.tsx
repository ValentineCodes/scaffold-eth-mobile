import React, { useState } from 'react'
import { Icon, Input, Pressable, Image, VStack, Text } from 'native-base';
import { Dimensions } from 'react-native';
import Modal from "react-native-modal"
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import QRCodeScanner from './QRCodeScanner';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import Button from '../Button';

type Props = {
    isVisible: boolean;
    isPairing: boolean;
    onClose: () => void;
    pair: (uri: string) => void;
}

export default function ConnectModal({ isVisible, isPairing, onClose, pair }: Props) {
    const [wcuri, setwcuri] = useState("")
    const [showScanner, setShowScanner] = useState(false)

    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" px="7" py="5" alignItems="center" space="4">
                <Image source={require("../../assets/icons/walletconnect.png")} alt="WalletConnect" style={{ width: Dimensions.get("window").height * 0.2, height: Dimensions.get("window").height * 0.1 }} />
                <Text color={COLORS.primary} bold fontSize={1.2 * FONT_SIZE['xl']}>Connect to dApp</Text>

                <VStack space={2} w="full">
                    <Input
                        value={wcuri}
                        borderRadius="lg"
                        variant="filled"
                        fontSize="md"
                        focusOutlineColor={COLORS.primary}
                        InputRightElement={
                            <Pressable onPress={() => setShowScanner(true)} mr="2" _pressed={{ opacity: 0.4 }}>
                                <Icon as={<MaterialCommunityIcons name="qrcode-scan" />} size={1.3 * FONT_SIZE['xl']} color={COLORS.primary} />
                            </Pressable>
                        }
                        secureTextEntry
                        placeholder="Enter the WalletConnect URI here"
                        onChangeText={setwcuri}
                        _input={{
                            selectionColor: COLORS.primary,
                            cursorColor: COLORS.primary,
                        }}
                        onSubmitEditing={() => pair(wcuri)}
                    />
                </VStack>

                <Button text="Connect" onPress={() => pair(wcuri)} loading={isPairing} />
            </VStack>

            {showScanner && <QRCodeScanner isOpen={showScanner} onClose={() => setShowScanner(false)} onReadCode={wcuri => {
                pair(wcuri)
                setShowScanner(false)
            }} />}
        </Modal>
    )
}