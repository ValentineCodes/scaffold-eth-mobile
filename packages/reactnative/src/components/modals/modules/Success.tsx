import React from 'react'
import { Dimensions } from 'react-native';
import Modal from "react-native-modal"
import { FONT_SIZE } from '../../../utils/styles';
import { VStack, Text, Image } from 'native-base';
import { COLORS } from '../../../utils/constants';
import Button from '../../Button';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onViewDetails: () => void;
}

export default function Success({ isVisible, onClose, onViewDetails }: Props) {

    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackdropPress={onClose} onBackButtonPress={onClose}>
            <VStack bgColor="white" borderRadius="40" px="7" py="5" alignItems="center" space="4">
                <Image source={require("../../../assets/images/success_transfer.png")} alt="Success!" style={{ width: Dimensions.get("window").height * 0.25, height: Dimensions.get("window").height * 0.25 }} />
                <Text color={COLORS.primary} bold fontSize={1.5 * FONT_SIZE['xl']}>Successfully Sent!</Text>
                <Text fontSize={FONT_SIZE['xl']} textAlign="center">Your crypto was sent successfully. You can view transaction below.</Text>
                <Button text="View Details" onPress={onViewDetails} />
                <Button type="outline" text="Cancel" onPress={onClose} />
            </VStack>
        </Modal>
    )
}