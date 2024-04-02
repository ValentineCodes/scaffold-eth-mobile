import { Button as RNButton, Divider, HStack, Text, VStack } from 'native-base'
import React from 'react'
import useAccount from '../../hooks/scaffold-eth/useAccount'
import useNetwork from '../../hooks/scaffold-eth/useNetwork'
import { truncateAddress } from '../../utils/helperFunctions'
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles'
import Blockie from '../Blockie'
import Button from '../Button'

type Props = {}

export default function SignTransactionModal({ }: Props) {
    const account = useAccount()
    const network = useNetwork()

    return (
        <VStack bgColor="white" borderRadius="30" p="5" space={4} w={WINDOW_WIDTH * 0.9}>
            <VStack space="2">
                <Text textAlign={"right"} fontSize={"md"} fontWeight={"medium"}>{network.name} network</Text>
                <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">From:</Text>

                <HStack alignItems="center" justifyContent="space-between" bgColor="#F5F5F5" borderRadius="10" p="2">
                    <HStack alignItems="center" space="2">
                        <Blockie address={account.address} size={1.8 * FONT_SIZE['xl']} />

                        <VStack w="75%">
                            <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{account.name}</Text>
                            <Text fontSize={FONT_SIZE['md']}>Balance: </Text>
                        </VStack>
                    </HStack>
                </HStack>
            </VStack>

            <VStack space="2">
                <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">To:</Text>

                <HStack alignItems="center" space="2" bgColor="#F5F5F5" borderRadius="10" p="2">
                    <Blockie address={account.address} size={1.8 * FONT_SIZE['xl']} />
                    <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{truncateAddress(account.address)}</Text>
                </HStack>
            </VStack>

            <HStack borderWidth="1" borderColor="muted.300" borderRadius="sm" alignSelf={"flex-start"} px={1.5} py={0.5}>
                <Text fontSize={"sm"} fontWeight={"medium"} color={"blue.500"}>{truncateAddress(account.address)}</Text>
                <Text fontSize={"sm"} fontWeight={"medium"}> : MINT</Text>
            </HStack>

            <Text fontSize={2 * FONT_SIZE["xl"]} bold textAlign="center">0 {network.currencySymbol}</Text>

            <VStack borderWidth="1" borderColor="muted.300" borderRadius="10">
                <HStack p="3" alignItems="flex-start" justifyContent="space-between">
                    <VStack>
                        <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">Estimated gas fee</Text>
                        <Text fontSize={FONT_SIZE['sm']} color="green.500">Likely in &lt; 30 second</Text>
                    </VStack>
                    <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" w="50%" textAlign="right">0.01240202 {network.currencySymbol}</Text>
                </HStack>

                <Divider bgColor="muted.100" />

                <HStack p="3" alignItems="flex-start" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">Total</Text>
                    <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" w="50%" textAlign="right">0.02020022 {network.currencySymbol}</Text>
                </HStack>
            </VStack>

            <HStack w="full" alignItems="center" justifyContent="space-between">
                <RNButton py="4" bgColor="red.100" w="50%" onPress={() => null} _pressed={{ background: 'red.200' }}><Text color="red.400" bold fontSize="md">Cancel</Text></RNButton>
                <Button text="Confirm" onPress={() => null} style={{ width: "50%", borderRadius: 0 }} />
            </HStack>
        </VStack>
    )
}