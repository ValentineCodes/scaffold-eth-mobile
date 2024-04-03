import { Button, Pressable, Text, View } from 'native-base'
import React, { useEffect } from 'react'
import useScaffoldContractWrite from '../../../hooks/scaffold-eth/useScaffoldContractWrite'
import useScaffoldContractRead from '../../../hooks/scaffold-eth/useScaffoldContractRead'

import { ethers } from 'ethers'

type Props = {}

export default function Home({ }: Props) {
    const { write } = useScaffoldContractWrite({ contractName: "YourContract", functionName: "setGreeting" })
    const { data: greeting, isLoading: isLoadingGreeting } = useScaffoldContractRead("YourContract", "greeting", [])
    const { data: premium, isLoading: isLoadingPremium } = useScaffoldContractRead("YourContract", "premium", [])

    const setGreeting = async () => {
        try {
            const tx = await write({ args: ["Hello, Ugo"], value: ethers.utils.parseEther("0.01") })
            console.log(tx.hash)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <View>
            <Button onPress={setGreeting}>Press me</Button>
            <Text>{greeting}</Text>
            <Text>{premium?.toString()}</Text>
        </View>
    )
}