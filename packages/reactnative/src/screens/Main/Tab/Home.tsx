import { Button, Pressable, Text, View } from 'native-base'
import React, { useEffect } from 'react'
import useScaffoldContractWrite from '../../../hooks/scaffold-eth/useScaffoldContractWrite'

type Props = {}

export default function Home({ }: Props) {
    const openModal = useScaffoldContractWrite()

    return (
        <View>
            <Button onPress={() => openModal("SignTransactionModal")}>Open</Button>
        </View>
    )
}