import { AbiFunction, Abi } from 'abitype';
import { Address } from 'viem';
import React, { useState } from 'react'
import useContractRead from '../../../../../../hooks/scaffold-eth/useContractRead';
import { useToast } from 'react-native-toast-notifications';
import { getFunctionInputKey, getInitialFormState, getParsedContractFunctionArgs } from './utilsContract';
import ContractInput from './ContractInput';
import { Button, HStack, Text, VStack, View } from 'native-base';
import { COLORS } from '../../../../../../utils/constants';

type Props = {
    contractAddress: Address;
    abiFunction: AbiFunction;
    abi: Abi;
}

export default function ReadOnlyFunctionForm({
    contractAddress,
    abiFunction,
    abi,
}: Props) {
    const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));
    const [result, setResult] = useState<unknown>();
    const toast = useToast()

    const { isLoading: isFetching, refetch } = useContractRead({
        address: contractAddress,
        functionName: abiFunction.name,
        abi: abi,
        args: getParsedContractFunctionArgs(form),
        enabled: false,
        onError: (error: any) => {
            toast.show(JSON.stringify(error), {
                type: "danger"
            })
        }
    })

    const inputElements = abiFunction.inputs.map((input, inputIndex) => {
        const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
        return (
            <ContractInput
                key={key}
                setForm={updatedFormValue => {
                    setResult(undefined);
                    setForm(updatedFormValue);
                }}
                form={form}
                stateObjectKey={key}
                paramType={input}
            />
        );
    });



    return (
        <View>
            <Text fontSize={"md"} fontWeight={"medium"} my={"2"}>{abiFunction.name}</Text>
            {inputElements}
            {result !== null && result !== undefined && (
                <VStack
                    bgColor={COLORS.primaryLight}
                    p={"2"}
                    rounded={"2xl"}
                    mt={"2"}
                >
                    <Text fontSize={"md"} fontWeight={"semibold"}>Result:</Text>
                    {result.map(data => (
                        <Text key={Math.random().toString()} fontSize={"sm"}>{typeof data == "object" && isNaN(data) ? JSON.stringify(data) : data.toString()}</Text>
                    ))}
                </VStack>
            )}
            <Button
                alignSelf={"flex-end"}
                my={"2"}
                w={"20"}
                py={"2"}
                borderRadius={"3xl"}
                bgColor={COLORS.primaryLight}
                isLoading={isFetching}
                isLoadingText='Read'
                _loading={{ bgColor: COLORS.primary }}
                _pressed={{ backgroundColor: 'rgba(39, 184, 88, 0.5)' }}
                onPress={async () => {
                    const data = await refetch();
                    setResult(data);
                }}
            >
                <Text fontSize={"md"} fontWeight={"medium"} color={COLORS.primary}>Read</Text>
            </Button>
        </View>
    )
}