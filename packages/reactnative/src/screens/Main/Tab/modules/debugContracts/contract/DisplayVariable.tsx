import { AbiFunction } from 'abitype';
import { InterfaceAbi } from 'ethers';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { Address, isAddress } from 'viem';
import AddressComp from '../../../../../../components/scaffold-eth/Address';
import { useContractRead } from '../../../../../../hooks/scaffold-eth';
import globalStyles from '../../../../../../styles/globalStyles';
import { COLORS } from '../../../../../../utils/constants';
import { FONT_SIZE } from '../../../../../../utils/styles';

type Props = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  abi: InterfaceAbi;
  refreshDisplayVariables: boolean;
};

export default function DisplayVariable({
  contractAddress,
  abiFunction,
  abi,
  refreshDisplayVariables
}: Props) {
  const toast = useToast();

  const {
    data: result,
    isLoading: isFetching,
    refetch
  } = useContractRead({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    onError: error => {
      toast.show(JSON.stringify(error), {
        type: 'danger'
      });
    }
  });

  useEffect(() => {
    refetch();
  }, [refreshDisplayVariables]);

  const renderResult = () => {
    if (result === null || result === undefined) return;

    if (typeof result == 'object' && isNaN(result)) {
      return <Text style={styles.result}>{JSON.stringify(result)}</Text>;
    }
    if (typeof result == 'object' && isNaN(result)) {
      return <Text style={styles.result}>{JSON.stringify(result)}</Text>;
    }
    if (isAddress(result.toString())) {
      return <AddressComp address={result.toString()} />;
    }

    return <Text style={styles.result}>{result.toString()}</Text>;
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={styles.functionName}>{abiFunction.name}</Text>
        <TouchableOpacity onPress={async () => await refetch()}>
          {isFetching ? (
            <ActivityIndicator
              size={1.2 * FONT_SIZE['sm']}
              color={COLORS.primary}
            />
          ) : (
            <MaterialIcons
              name="cached"
              color={COLORS.primary}
              size={1.2 * FONT_SIZE['sm']}
            />
          )}
        </TouchableOpacity>
      </View>
      {renderResult()}
    </View>
  );
}

const styles = StyleSheet.create({
  functionName: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.textMedium
  },
  result: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.text
  }
});
