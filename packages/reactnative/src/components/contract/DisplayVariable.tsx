import { Abi, AbiFunction } from 'abitype';
import { HStack, Pressable, Spinner, Text, VStack } from 'native-base'
import React, { useEffect } from 'react'
import { useToast } from 'react-native-toast-notifications';
import { Address } from 'viem';
import useContractRead from '../../hooks/scaffold-eth/useContractRead';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"


type Props = {
    contractAddress: Address;
    abiFunction: AbiFunction;
    abi: Abi;
}

export default function DisplayVariable({
    contractAddress,
    abiFunction,
    abi
}: Props) {
    const toast = useToast()

    const {
        data: result,
        isLoading: isFetching,
        refetch,
    } = useContractRead({
        address: contractAddress,
        functionName: abiFunction.name,
        abi: abi,
        onError: error => {
            toast.show(JSON.stringify(error), {
                type: "error"
            })
        },
    });

    useEffect(() => {
        refetch();
    }, []);

    return (
        <VStack space={1} mb={"4"}>
            <HStack alignItems={"center"} space={2}>
                <Text fontSize={"lg"} fontWeight={"semibold"}>{abiFunction.name}</Text>
                <Pressable onPress={async () => await refetch()}>
                    {isFetching ? (
                        <Spinner size={1.2 * FONT_SIZE["sm"]} color={COLORS.primary} />
                    ) : (
                        <MaterialIcons
                            name="cached"
                            color="blue"
                            size={1.2 * FONT_SIZE["sm"]}
                        />
                    )}
                </Pressable>
            </HStack>
            {result !== null && result !== undefined && result.map(data => (
                <Text key={Math.random().toString()} fontSize={"sm"}>{typeof data == "object" && isNaN(data) ? JSON.stringify(data) : data.toString()}</Text>
            ))}
        </VStack>
    )
}