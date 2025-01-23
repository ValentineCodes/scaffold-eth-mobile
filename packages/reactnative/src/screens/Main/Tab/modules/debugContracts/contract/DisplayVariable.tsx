import { Abi, AbiFunction } from "abitype";
import React, { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { Address, isAddress } from "viem";
import useContractRead from "../../../../../../hooks/scaffold-eth/useContractRead";
import { COLORS } from "../../../../../../utils/constants";
import { FONT_SIZE } from "../../../../../../utils/styles";
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons";
import AddressComp from "../../../../../../components/scaffold-eth/Address";

type Props = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  abi: Abi;
  refreshDisplayVariables: boolean;
};

export default function DisplayVariable({
  contractAddress,
  abiFunction,
  abi,
  refreshDisplayVariables,
}: Props) {
  const toast = useToast();

  const {
    data: result,
    isLoading: isFetching,
    refetch,
  } = useContractRead({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    onError: (error) => {
      toast.show(JSON.stringify(error), {
        type: "danger",
      });
    },
  });

  useEffect(() => {
    refetch();
  }, [refreshDisplayVariables]);

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text variant="titleMedium">
          {abiFunction.name}
        </Text>
        <TouchableOpacity onPress={async () => await refetch()}>
          {isFetching ? (
            <ActivityIndicator size={1.2 * FONT_SIZE["sm"]} color={COLORS.primary} />
          ) : (
            <MaterialIcons
              name="cached"
              color={COLORS.primary}
              size={1.2 * FONT_SIZE["sm"]}
            />
          )}
        </TouchableOpacity>
      </View>
      {result !== null &&
        result !== undefined &&
        result.map((data) => {
          if (typeof data == "object" && isNaN(data)) {
            return (
              <Text key={Math.random().toString()} variant="bodyMedium">
                {JSON.stringify(data)}
              </Text>
            );
          }

          if (isAddress(data.toString())) {
            return (
              <AddressComp
                key={Math.random().toString()}
                address={data.toString()}
              />
            );
          }

          return (
            <Text key={Math.random().toString()} variant="bodyMedium">
              {data.toString()}
            </Text>
          );
        })}
    </View>
  );
}
