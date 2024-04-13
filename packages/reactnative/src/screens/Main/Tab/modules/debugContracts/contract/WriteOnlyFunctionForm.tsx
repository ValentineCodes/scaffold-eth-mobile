import { Abi, AbiFunction, Address } from 'abitype';
import React, { useState } from 'react'
import { getFunctionInputKey, getInitialFormState, getParsedContractFunctionArgs } from './utilsContract';
import useNetwork from '../../../../../../hooks/scaffold-eth/useNetwork';
import useTargetNetwork from '../../../../../../hooks/scaffold-eth/useTargetNetwork';
import useContractWrite from '../../../../../../hooks/scaffold-eth/useContractWrite';
import { BigNumber } from 'ethers';
import { useToast } from 'react-native-toast-notifications';
import { TransactionReceipt } from 'viem';
import ContractInput from './ContractInput';
import { Button, HStack, Text, View } from 'native-base';
import IntegerInput from '../../../../../../components/scaffold-eth/input/IntegerInput';
import { COLORS } from '../../../../../../utils/constants';
import { useModal } from 'react-native-modalfy';

type Props = {
    abi: Abi;
    abiFunction: AbiFunction;
    contractAddress: Address;
    onChange: () => void;
}

export default function WriteOnlyFunctionForm({
    abi,
    abiFunction,
    contractAddress,
    onChange
}: Props) {
    const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));
    const [txValue, setTxValue] = useState<string | bigint>("");
    const network = useNetwork()
    const targetNetwork = useTargetNetwork()
    const toast = useToast()
    const [txReceipt, setTxReceipt] = useState<TransactionReceipt | undefined>();
    const { openModal } = useModal()
    const writeDisabled = !network || network?.id !== targetNetwork.id;

    const { isLoading, write } = useContractWrite({
        address: contractAddress,
        functionName: abiFunction.name,
        abi: abi,
        args: getParsedContractFunctionArgs(form)
    })

    const handleWrite = async () => {
        try {
            const receipt = await write({ value: BigNumber.from(txValue || 0) });
            setTxReceipt(receipt)
            onChange();
        } catch (error) {
            toast.show(JSON.stringify(error), { type: "danger" })
        }
    };

    const inputElements = abiFunction.inputs.map((input, inputIndex) => {
        const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
        return (
            <ContractInput
                key={key}
                setForm={updatedFormValue => {
                    setTxReceipt(undefined);
                    setForm(updatedFormValue);
                }}
                form={form}
                stateObjectKey={key}
                paramType={input}
            />
        );
    });
    const zeroInputs = inputElements.length === 0 && abiFunction.stateMutability !== "payable";

    const showReceipt = () => {
        openModal("TxReceiptModal", { txReceipt })
    }
    return (
        <View>
            <Text fontSize={"md"} fontWeight={"medium"} my={"2"}>{abiFunction.name}</Text>
            {inputElements}
            {abiFunction.stateMutability === "payable" ? (
                <View mt={"2"}>
                    <IntegerInput
                        value={txValue}
                        onChange={updatedTxValue => {
                            setTxReceipt(undefined);
                            setTxValue(updatedTxValue);
                        }}
                        placeholder="value (wei)"
                    />
                </View>
            ) : null}
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                {txReceipt ? (
                    <Button
                        alignSelf={"flex-end"}
                        my={"2"}
                        py={"2"}
                        borderRadius={"3xl"}
                        bgColor={"blue.300"}
                        _pressed={{ backgroundColor: 'rgba(39, 184, 88, 0.5)' }}
                        onPress={showReceipt}
                    >
                        <Text fontSize={"md"} fontWeight={"medium"} color={"white"}>Show Receipt</Text>
                    </Button>
                ) : <View />}

                <Button
                    alignSelf={"flex-end"}
                    my={"2"}
                    w={"20"}
                    py={"2"}
                    borderRadius={"3xl"}
                    bgColor={COLORS.primaryLight}
                    isLoading={isLoading}
                    isLoadingText='Send'
                    _loading={{ bgColor: COLORS.primary }}
                    isDisabled={writeDisabled || isLoading}
                    _pressed={{ backgroundColor: 'rgba(39, 184, 88, 0.5)' }}
                    onPress={handleWrite}
                >
                    <Text fontSize={"md"} fontWeight={"medium"} color={COLORS.primary}>Send</Text>
                </Button>
            </HStack>
        </View>
    )
}