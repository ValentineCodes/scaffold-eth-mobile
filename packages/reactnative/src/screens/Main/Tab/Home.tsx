import { Button, Pressable, Text, View } from 'native-base'
import React, { useEffect } from 'react'
import useScaffoldContractWrite from '../../../hooks/scaffold-eth/useScaffoldContractWrite'
import useScaffoldContractRead from '../../../hooks/scaffold-eth/useScaffoldContractRead'

import { ethers } from 'ethers'
import useSignMessage from '../../../hooks/scaffold-eth/useSignMessage'

type Props = {}

export default function Home({ }: Props) {
    const { write } = useScaffoldContractWrite({ contractName: "YourContract", functionName: "setGreeting" })
    const { data: greeting, isLoading: isLoadingGreeting } = useScaffoldContractRead("YourContract", "greeting", [])
    const { data: premium, isLoading: isLoadingPremium } = useScaffoldContractRead("YourContract", "premium", [])
    const { signMessage } = useSignMessage()

    const setGreeting = async () => {
        try {
            const tx = await write({ args: ["Hello, Ugo"], value: ethers.utils.parseEther("0.01") })
            console.log(tx.hash)
        } catch (error) {
            console.error(error)
        }
    }

    const sign = async () => {
        try {
            const signature = await signMessage({ message: "Mollit id cillum deserunt pariatur aliquip do pariatur est exercitation ut ut eiusmod consequat eu. Ad nulla consectetur ut elit quis ad fugiat proident incididunt mollit incididunt esse veniam id. Ad irure velit laboris dolore est laborum laborum amet officia duis excepteur. Duis Lorem voluptate adipisicing ea. Anim cillum cupidatat voluptate cillum cillum proident commodo et cupidatat. Lorem sunt proident officia ullamco irure laboris exercitation velit eu culpa pariatur. Mollit deserunt culpa incididunt ex labore elit occaecat dolore aliquip non aute." })

            console.log(signature)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <View>
            <Button onPress={sign}>Press me</Button>
            <Text>{greeting}</Text>
            <Text>{premium?.toString()}</Text>
        </View>
    )
}