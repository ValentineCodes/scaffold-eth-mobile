import { Icon, Pressable, ScrollView, Spinner, Text, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import useScaffoldContractWrite from '../hooks/scaffold-eth/useScaffoldContractWrite'
import { ethers } from 'ethers'
import { useToast } from 'react-native-toast-notifications'
import useAccount from '../hooks/scaffold-eth/useAccount'
import { COLORS } from '../utils/constants'
import { RefreshControl } from 'react-native'
import useNetwork from '../hooks/scaffold-eth/useNetwork'
import { useDeployedContractInfo } from '../hooks/scaffold-eth/useDeployedContractInfo'
import SnowmanList from '../components/SnowmanList'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { FONT_SIZE } from '../utils/styles'

type Props = {}

export default function Home({ }: Props) {
    const toast = useToast()
    const account = useAccount()
    const network = useNetwork()
    const isFocused = useIsFocused()
    const navigation = useNavigation()

    const { data: snowmanContract, isLoading: isLoadingSnowmanContract } = useDeployedContractInfo("Snowman")

    const { write: mintSnowman } = useScaffoldContractWrite({
        contractName: "Snowman",
        functionName: "mint",
        value: ethers.utils.parseEther("0.02"),
        gasLimit: ethers.BigNumber.from("500000")
    })

    const [balance, setBalance] = useState(0)
    const [isLoadingBalance, setIsLoadingBalance] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isMinting, setIsMinting] = useState(false)

    const mint = async () => {
        try {
            setIsMinting(true)
            await mintSnowman()

            setBalance(balance + 1)
            toast.show("Minted One(1) Snowman☃️", { type: "success" })
        } catch (error) {
            toast.show(JSON.stringify(error), { type: "danger" })
        } finally {
            setIsMinting(false)
        }
    }

    const getSnowmanBalance = async () => {
        try {
            if (isLoadingSnowmanContract) return

            setIsLoadingBalance(true)

            const provider = new ethers.providers.JsonRpcProvider(network.provider)

            const snowman = new ethers.Contract(snowmanContract?.address, snowmanContract?.abi, provider)
            const balance = (await snowman.balanceOf(account.address)).toNumber()
            setBalance(balance)
        } catch (error) {
            console.error(error)
            return
        } finally {
            setIsLoadingBalance(false)
        }
    }

    const refreshBalance = async () => {
        setIsRefreshing(true)
        await getSnowmanBalance()
        setIsRefreshing(false)
    }

    useEffect(() => {
        if (!isFocused) return
        getSnowmanBalance()
    }, [account, network, isLoadingSnowmanContract, isFocused])

    if (!isFocused) return
    return (
        <ScrollView
            flex={"1"}
            bgColor={"white"}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshBalance} colors={[COLORS.primary]} tintColor={COLORS.primary} />}
        >
            <Pressable
                onPress={() => navigation.goBack()}
                _pressed={{ opacity: 0.4 }}
                mt={15}
                ml={15}
            >
                <Icon as={<Ionicons name="arrow-back-outline" />} size={1.3 * FONT_SIZE['xl']} color="black" />
            </Pressable>
            <VStack px={"4"} pt={"8"} alignItems={"center"}>
                <Text fontSize={"2xl"} fontWeight={"light"}>Do you wanna build a</Text>
                <Text fontSize={"4xl"} fontWeight={"bold"}>Snowman☃️</Text>

                <Text fontSize={"lg"} mt={"4"} mb={"1"} textAlign={"center"}>Mint a unique Snowman☃️ for 0.02 ETH</Text>

                <Button text='Mint' loading={isMinting} onPress={mint} style={{ width: 100, borderRadius: 10, marginVertical: 15 }} />
            </VStack>

            {isLoadingBalance && !isRefreshing ? (
                <Spinner color={COLORS.primary} />
            ) : (
                <SnowmanList balance={balance} />
            )}

        </ScrollView>
    )
}