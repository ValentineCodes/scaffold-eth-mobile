import { AbiFunction, Abi } from "abitype";
import { Address } from "viem";
import React, { useState } from "react";
import useContractRead from "../../../../../../hooks/scaffold-eth/useContractRead";
import { useToast } from "react-native-toast-notifications";
import {
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
} from "./utilsContract";
import ContractInput from "./ContractInput";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { COLORS } from "../../../../../../utils/constants";

type Props = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  abi: Abi;
};

export default function ReadOnlyFunctionForm({
  contractAddress,
  abiFunction,
  abi,
}: Props) {
  const [form, setForm] = useState<Record<string, any>>(() =>
    getInitialFormState(abiFunction),
  );
  const [result, setResult] = useState<unknown>();
  const toast = useToast();

  const { isLoading: isFetching, refetch } = useContractRead({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    args: getParsedContractFunctionArgs(form),
    enabled: false,
    onError: (error: any) => {
      toast.show(JSON.stringify(error), {
        type: "danger",
      });
    },
  });

  const inputElements = abiFunction.inputs.map((input, inputIndex) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={(updatedFormValue) => {
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
      <Text variant="titleMedium" style={{ marginVertical: 8 }}>
        {abiFunction.name}
      </Text>
      {inputElements}
      {result !== null && result !== undefined && (
        <Card style={{ backgroundColor: COLORS.primaryLight, marginTop: 8 }}>
          <Card.Content>
            <Text variant="titleMedium">Result:</Text>
            {result.map((data: any) => (
              <Text key={Math.random().toString()} variant="bodyMedium">
                {typeof data == "object" && isNaN(data)
                  ? JSON.stringify(data)
                  : data.toString()}
              </Text>
            ))}
          </Card.Content>
        </Card>
      )}
      <Button
        mode="contained"
        style={{
          marginVertical: 8,
          borderRadius: 24,
          alignSelf: 'flex-end',
          backgroundColor: isFetching ? COLORS.primary : COLORS.primaryLight
        }}
        loading={isFetching}
        onPress={async () => {
          const data = await refetch();
          setResult(Array.isArray(data) ? data : [data]);
        }}
      >
        Read
      </Button>
    </View>
  );
}
