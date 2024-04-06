import React from 'react'
import { Dimensions } from 'react-native';
import Modal from "react-native-modal"
import { FONT_SIZE } from '../../../utils/styles';
import { VStack, Text, Image } from 'native-base';
import Button from '../../Button';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onRetry: () => void;
}

export default function Fail({ isVisible, onClose, onRetry }: Props) {

    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackdropPress={onClose} onBackButtonPress={onClose}>
            <VStack bgColor="white" borderRadius="40" px="7" py="5" alignItems="center" space="4">
                <Image source={require("../../../assets/images/fail_icon.png")} alt="Success!" style={{ width: Dimensions.get("window").height * 0.25, height: Dimensions.get("window").height * 0.25 }} />
                <Text color="#F75554" bold fontSize={1.5 * FONT_SIZE['xl']}>Oops...Failed!</Text>
                <Text fontSize={FONT_SIZE['xl']} textAlign="center">Please check your internet connection and try again.</Text>
                <Button text="Try Again" onPress={onRetry} />
                <Button type="outline" text="Cancel" onPress={onClose} />
            </VStack>
        </Modal>
    )
}