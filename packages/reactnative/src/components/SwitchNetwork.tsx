import { Pressable, ScrollView, Text, VStack } from 'native-base'
import React, { useState } from 'react'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { WINDOW_WIDTH } from '../utils/styles'
import { useDispatch, useSelector } from 'react-redux'
import { Network, switchNetwork } from '../store/reducers/Networks'

import scaffoldConfig, { Localhost } from '../../scaffold.config'
import Modal from 'react-native-modal'
import { useToast } from 'react-native-toast-notifications'
import * as chains from "viem/chains";

type Props = {}

export default function SwitchNetwork({ }: Props) {
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))
    const [showNetworkSwitchModal, setShowNetworkSwitchModal] = useState(false)
    const dispatch = useDispatch()
    const toast = useToast()

    if (scaffoldConfig.targetNetworks.map(network => network.chainId || network.id).includes(connectedNetwork.chainId)) return

    const closeModal = () => {
        setShowNetworkSwitchModal(false)
    }

    const handleNetworkSelecttion = (network: chains.Chain | Localhost) => {
        closeModal()
        dispatch(switchNetwork((network.chainId || network.id).toString()))
        toast.show(`Switched to ${network.name}`)
    }

    return (
        <Pressable
            position={"absolute"}
            bottom={10}
            right={5}
            bgColor={"red.500"}
            rounded={"full"}
            p={"4"}
            onPress={() => setShowNetworkSwitchModal(true)}
        >
            <Ionicons
                name="alert-circle-outline"
                size={WINDOW_WIDTH * 0.07}
                color="white"
            />

            {showNetworkSwitchModal && <Modal isVisible={showNetworkSwitchModal} onBackButtonPress={closeModal} onBackdropPress={closeModal}>
                <VStack bgColor="white" rounded={"md"} p="4" space={2} maxH={"50%"}>
                    <Text fontSize={"xl"} fontWeight={"semibold"}>Switch to</Text>

                    <ScrollView>
                        {scaffoldConfig.targetNetworks.map(network => (
                            <Pressable key={network.chainId} py={"4"} onPress={() => handleNetworkSelecttion(network)}>
                                <Text fontSize={"md"}>{network.name}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </VStack>
            </Modal>}
        </Pressable>
    )
}