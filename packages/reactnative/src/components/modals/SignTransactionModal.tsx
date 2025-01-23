import { View } from "react-native";
import { Button as PaperButton, Divider, Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import useAccount from "../../hooks/scaffold-eth/useAccount";
import useNetwork from "../../hooks/scaffold-eth/useNetwork";
import { parseFloat, truncateAddress } from "../../utils/helperFunctions";
import { FONT_SIZE } from "../../utils/styles";
import Blockie from "../Blockie";
import Button from "../Button";

import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import useBalance from "../../hooks/scaffold-eth/useBalance";

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      contract: ethers.Contract;
      contractAddress: string;
      functionName: string;
      args: any[];
      value: bigint;
      gasLimit: bigint | number;
      onConfirm: () => void;
      onReject: () => void;
    };
  };
};

interface GasCost {
  min: bigint | null;
  max: bigint | null;
}

export default function SignTransactionModal({
  modal: { closeModal, params },
}: Props) {
  const account = useAccount();
  const network = useNetwork();
  const { balance, isLoading: isLoadingBalance } = useBalance({
    address: account.address,
  });

  const [estimatedGasCost, setEstimatedGasCost] = useState<GasCost>({
    min: null,
    max: null,
  });

  const estimateGasCost = async () => {
    const provider = new ethers.JsonRpcProvider(network.provider);

    const gasEstimate = await params.contract.getFunction(params.functionName).estimateGas(
      ...params.args,
      {
        value: params.value,
        gasLimit: params.gasLimit,
      },
    );
    const feeData = await provider.getFeeData();

    const gasCost: GasCost = {
      min: null,
      max: null,
    };

    if (feeData.gasPrice) {
      gasCost.min = gasEstimate * feeData.gasPrice;
    }

    if (feeData.maxFeePerGas) {
      gasCost.max = gasEstimate * feeData.maxFeePerGas;
    }

    setEstimatedGasCost(gasCost);
  };

  const calcTotal = () => {
    const minAmount =
      estimatedGasCost.min &&
      parseFloat(
        ethers.formatEther(params.value + estimatedGasCost.min),
        8,
      ).toString();
    const maxAmount =
      estimatedGasCost.max &&
      parseFloat(
        ethers.formatEther(params.value + estimatedGasCost.max),
        8,
      ).toString();
    return {
      min: minAmount,
      max: maxAmount,
    };
  };

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(network.provider);

    provider.removeAllListeners("block");

    provider.on("block", (blockNumber: number) => estimateGasCost());

    return () => {
      provider.removeAllListeners("block");
    };
  }, []);

  function confirm() {
    closeModal();
    params.onConfirm();
  }

  function reject() {
    closeModal();
    params.onReject();
  }

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 30,
      padding: 20,
    }}>
      <View style={{marginBottom: 16}}>
        <Text variant="bodyMedium" style={{textAlign: 'right'}}>
          {network.name} network
        </Text>
        <Text variant="titleMedium">From:</Text>

        <View style={{
          backgroundColor: '#F5F5F5',
          borderRadius: 10,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Blockie address={account.address} size={1.8 * FONT_SIZE.xl} />
          <View style={{marginLeft: 12}}>
            <Text variant="titleLarge">{account.name}</Text>
            <Text variant="bodyMedium">
              Balance: {balance && `${balance} ${network.currencySymbol}`}
            </Text>
          </View>
        </View>
      </View>

      <View style={{marginBottom: 16}}>
        <Text variant="titleMedium">To:</Text>
        <View style={{
          backgroundColor: '#F5F5F5',
          borderRadius: 10,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Blockie address={params.contractAddress} size={1.8 * FONT_SIZE.xl} />
          <Text variant="titleLarge" style={{marginLeft: 12}}>
            {truncateAddress(params.contractAddress)}
          </Text>
        </View>
      </View>

      <Text variant="headlineMedium" style={{textAlign: 'center', marginBottom: 16}}>
        {ethers.formatEther(params.value)} {network.currencySymbol}
      </Text>

      <View style={{
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        marginBottom: 16
      }}>
        {/* Gas Fee Section */}
        <View style={{padding: 12}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text variant="titleMedium">Estimated Gas Fee</Text>
              <Text variant="bodySmall" style={{color: 'green'}}>
                Likely in {'<'} 30 seconds
              </Text>
            </View>
            <View>
              <Text variant="titleMedium" style={{textAlign: 'right'}}>
                {estimatedGasCost.min && ethers.formatEther(estimatedGasCost.min)} {network.currencySymbol}
              </Text>
              <Text variant="bodySmall" style={{color: 'gray', textAlign: 'right'}}>
                Max: {estimatedGasCost.max && ethers.formatEther(estimatedGasCost.max)} {network.currencySymbol}
              </Text>
            </View>
          </View>
        </View>

        <Divider />

        {/* Total Section */}
        <View style={{padding: 12}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text variant="titleMedium">Total</Text>
              <Text variant="bodySmall" style={{color: 'green'}}>
                Amount + Gas Fee
              </Text>
            </View>
            <View>
              <Text variant="titleMedium" style={{textAlign: 'right'}}>
                {calcTotal().min} {network.currencySymbol}
              </Text>
              <Text variant="bodySmall" style={{color: 'gray', textAlign: 'right'}}>
                Max: {calcTotal().max} {network.currencySymbol}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{flexDirection: 'row', gap: 12}}>
        <PaperButton
          mode="contained"
          onPress={reject}
          buttonColor="#FFCDD2"
          style={{flex: 1}}
        >
          Reject
        </PaperButton>
        <PaperButton
          mode="contained"
          onPress={confirm}
          style={{flex: 1}}
        >
          Confirm
        </PaperButton>
      </View>
    </View>
  );
}
