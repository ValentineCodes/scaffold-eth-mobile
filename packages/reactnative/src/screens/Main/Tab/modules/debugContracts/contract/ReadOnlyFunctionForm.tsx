import { AbiFunction } from 'abitype';
import { InterfaceAbi } from 'ethers';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { Address } from 'viem';
import useContractRead from '../../../../../../hooks/scaffold-eth/useContractRead';
import globalStyles from '../../../../../../styles/globalStyles';
import { COLORS } from '../../../../../../utils/constants';
import { FONT_SIZE } from '../../../../../../utils/styles';
import ContractInput from './ContractInput';
import {
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs
} from './utilsContract';

type Props = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  abi: InterfaceAbi;
};

export default function ReadOnlyFunctionForm({
  contractAddress,
  abiFunction,
  abi
}: Props) {
  const [form, setForm] = useState<Record<string, any>>(() =>
    getInitialFormState(abiFunction)
  );
  const [result, setResult] = useState<any>();
  const toast = useToast();

  const { isLoading: isFetching, refetch } = useContractRead({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    args: getParsedContractFunctionArgs(form),
    enabled: false,
    onError: (error: any) => {
      toast.show(JSON.stringify(error), {
        type: 'danger'
      });
    }
  });

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
      <Text style={{ fontSize: FONT_SIZE['md'], ...globalStyles.textMedium }}>
        {abiFunction.name}
      </Text>

      <View style={{ gap: 4, marginTop: 10 }}>{inputElements}</View>

      {result !== null && result !== undefined && (
        <Card style={{ backgroundColor: COLORS.primaryLight, marginTop: 8 }}>
          <Card.Content>
            <Text
              style={{ fontSize: FONT_SIZE['md'], ...globalStyles.textMedium }}
            >
              Result:
            </Text>
            {result.map((data: any) => (
              <Text
                key={Math.random().toString()}
                style={{ fontSize: FONT_SIZE['md'], ...globalStyles.text }}
              >
                {typeof data == 'object' && isNaN(data)
                  ? JSON.stringify(data)
                  : data?.toString()}
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
        labelStyle={{
          fontSize: FONT_SIZE['md'],
          ...globalStyles.text,
          color: isFetching ? 'white' : 'black'
        }}
        loading={isFetching}
        onPress={async () => {
          const data = await refetch();
          if (data === undefined) return;
          setResult(Array.isArray(data) ? data : [data]);
        }}
      >
        Read
      </Button>
    </View>
  );
}
