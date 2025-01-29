import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Divider, Button as PaperButton, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Blockie from '../../components/Blockie';
import { Account } from '../../store/reducers/Accounts';
import {
  parseBalance,
  parseFloat,
  truncateAddress
} from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { formatEther, JsonRpcProvider, parseEther, Wallet } from 'ethers';
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { Address } from 'viem';
import Button from '../../components/Button';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { addRecipient } from '../../store/reducers/Recipients';
import { getProviderWithName, Providers } from '../../utils/providers';
import Fail from './modules/Fail';
import Success from './modules/Success';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      from: Account;
      to: Address;
      value: bigint;
    };
  };
};

interface GasCost {
  min: bigint | null;
  max: bigint | null;
}

export default function SignTransferModal({
  modal: { closeModal, params }
}: Props) {
  const { from, to, value } = params;

  const dispatch = useDispatch();

  const toast = useToast();

  const network = useNetwork();

  const { balance } = useBalance({ address: from.address });

  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [txReceipt, setTxReceipt] = useState<any | null>(null);
  const [estimatedGasCost, setEstimatedGasCost] = useState<GasCost>({
    min: null,
    max: null
  });

  const { getItem } = useSecureStorage();

  const calcTotal = () => {
    const minAmount =
      estimatedGasCost.min &&
      parseFloat(formatEther(value + estimatedGasCost.min), 8).toString();
    const maxAmount =
      estimatedGasCost.max &&
      parseFloat(formatEther(value + estimatedGasCost.max), 8).toString();
    return {
      min: minAmount,
      max: maxAmount
    };
  };

  const transfer = async () => {
    const accounts = await getItem('accounts');
    const activeAccount = Array.from(accounts).find(
      account => account.address.toLowerCase() === from.address.toLowerCase()
    );

    const provider = getProviderWithName(
      network.name.toLowerCase() as keyof Providers
    );
    const wallet = new Wallet(activeAccount.privateKey, provider);

    try {
      setIsTransferring(true);

      const tx = await wallet.sendTransaction({
        from: from.address,
        to: to,
        value: parseEther(value.toString())
      });

      const txReceipt = await tx.wait(1);

      setTxReceipt(txReceipt);
      setShowSuccessModal(true);

      dispatch(addRecipient(to));
    } catch (error) {
      setShowFailModal(true);
      return;
    } finally {
      setIsTransferring(false);
    }
  };

  const viewTxDetails = async () => {
    if (!network.blockExplorer || !txReceipt) return;

    try {
      await Linking.openURL(`${network.blockExplorer}/tx/${txReceipt.hash}`);
    } catch (error) {
      toast.show('Cannot open url', {
        type: 'danger'
      });
    }
  };

  const estimateGasCost = async () => {
    const provider = new JsonRpcProvider(network.provider);

    const feeData = await provider.getFeeData();

    const gasEstimate = feeData.gasPrice * BigInt(21000);

    const gasCost: GasCost = {
      min: null,
      max: null
    };

    if (feeData.gasPrice) {
      gasCost.min = gasEstimate;
    }

    if (feeData.maxFeePerGas) {
      gasCost.max = (gasEstimate * feeData.maxFeePerGas) / feeData.gasPrice;
    }

    setEstimatedGasCost(gasCost);
  };

  useEffect(() => {
    const provider = new JsonRpcProvider(network.provider);

    provider.off('block');

    provider.on('block', blockNumber => estimateGasCost());

    return () => {
      provider.off('block');
    };
  }, []);

  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 30,
          padding: 20
        }}
      >
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 10,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16
            }}
          >
            <Blockie address={from.address} size={1.8 * FONT_SIZE.xl} />
            <View style={{ marginLeft: 12 }}>
              <Text variant="titleMedium">{from.name}</Text>
              <Text variant="bodyMedium">
                Balance:{' '}
                {balance !== null
                  ? `${parseBalance(balance)} ${network.currencySymbol}`
                  : null}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 10,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Blockie address={to} size={1.8 * FONT_SIZE.xl} />
            <Text variant="titleMedium" style={{ marginLeft: 12 }}>
              {truncateAddress(to)}
            </Text>
          </View>
        </View>

        <Text
          variant="headlineMedium"
          style={{ textAlign: 'center', marginBottom: 16 }}
        >
          {formatEther(value)} {network.currencySymbol}
        </Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: '#E0E0E0',
            borderRadius: 10,
            marginBottom: 16
          }}
        >
          <View style={{ padding: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8
              }}
            >
              <Text variant="titleMedium">Estimated Gas Fee</Text>
              <Text variant="titleMedium">
                {estimatedGasCost.min &&
                  `${formatEther(estimatedGasCost.min)} ${network.currencySymbol}`}
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text variant="bodySmall" style={{ color: 'green' }}>
                Likely in {'<'} 30 seconds
              </Text>
              <Text variant="bodySmall" style={{ color: 'gray' }}>
                Max:{' '}
                {estimatedGasCost.max &&
                  `${formatEther(estimatedGasCost.max)} ${network.currencySymbol}`}
              </Text>
            </View>
          </View>

          <Divider />

          <View style={{ padding: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8
              }}
            >
              <Text variant="titleMedium">Total</Text>
              <Text variant="titleMedium">
                {calcTotal().min} {network.currencySymbol}
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text variant="bodySmall" style={{ color: 'green' }}>
                Amount + Gas Fee
              </Text>
              <Text variant="bodySmall" style={{ color: 'gray' }}>
                Max: {calcTotal().max} {network.currencySymbol}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <PaperButton
            mode="contained"
            onPress={closeModal}
            buttonColor="#FFCDD2"
            style={{ flex: 1 }}
          >
            Reject
          </PaperButton>
          <Button
            text="Confirm"
            onPress={transfer}
            style={{ flex: 1, borderRadius: 0 }}
            loading={isTransferring}
          />
        </View>
      </View>

      <Success
        isVisible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          closeModal();
        }}
        onViewDetails={viewTxDetails}
      />

      <Fail
        isVisible={showFailModal}
        onClose={() => setShowFailModal(false)}
        onRetry={() => {
          setShowFailModal(false);
          transfer();
        }}
      />
    </>
  );
}
