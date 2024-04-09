import { ScrollView, Spinner, Text, VStack } from 'native-base'
import React, { useState, useEffect } from 'react'
import useAccount from '../hooks/scaffold-eth/useAccount'
import { useDeployedContractInfo } from '../hooks/scaffold-eth/useDeployedContractInfo'
import { ethers } from 'ethers'
import useNetwork from '../hooks/scaffold-eth/useNetwork'
import { COLORS } from '../utils/constants'
import Snowman from './Snowman'

type Props = { balance: number }

export default function SnowmanList({ balance }: Props) {
    const [snowmanBalance, setSnowmanBalance] = useState(balance)
    const [snowmen, setSnowmen] = useState<any[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const account = useAccount()
    const network = useNetwork()

    const { data: snowmanContract, isLoading: isLoadingSnowmanContract } = useDeployedContractInfo("Snowman")

    useEffect(() => {
        if (isLoadingSnowmanContract) return

        (async () => {
            setIsLoading(true)
            setSnowmanBalance(balance)

            const provider = new ethers.providers.JsonRpcProvider(network.provider)

            const snowman = new ethers.Contract(snowmanContract?.address, snowmanContract?.abi, provider)
            const tokenIds = [];
            for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
                try {
                    const tokenId = await snowman.tokenOfOwnerByIndex(account.address, tokenIndex);
                    tokenIds.push({ id: tokenId });
                } catch (error) {
                    console.error(error)
                }
            }
            setSnowmen(tokenIds)
            setIsLoading(false)
        })()
    }, [balance, isLoadingSnowmanContract])

    const renderSnowmanList = () => {
        if (!snowmen && isLoading) return <Spinner color={COLORS.primary} />

        if (!snowmen || snowmen.length === 0) return

        return snowmen.map(snowman => {
            const remove = () => {
                setSnowmen(snowmen => snowmen?.filter(_snowman => _snowman.id.toNumber() !== snowman.id.toNumber()))
                setSnowmanBalance(balance - 1)
            }
            return <Snowman key={snowman.id} id={snowman.id} remove={remove} />
        })
    }

    return (
        <VStack>
            <Text fontSize={"lg"} mt={"4"} mb={"1"} textAlign={"center"}>You own {snowmanBalance} Snowman☃️</Text>
            <ScrollView contentContainerStyle={{ alignItems: "center" }}>
                {renderSnowmanList()}
            </ScrollView>
        </VStack>
    )
}