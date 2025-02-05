import {
  useIsFocused,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import Button from '../../components/Button';
import { Account } from '../../store/reducers/Accounts';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {
  Contract,
  isAddress,
  JsonRpcProvider,
  TransactionReceipt,
  Wallet
} from 'ethers';
import { useModal } from 'react-native-modalfy';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { erc721Abi } from 'viem';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { addRecipient } from '../../store/reducers/Recipients';
import Header from './modules/Header';
import PastRecipients from './modules/PastRecipients';
import Recipient from './modules/Recipient';
import Sender from './modules/Sender';

export default function NFTTokenTransfer() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const route = useRoute();

  // @ts-ignore
  const token = route.params.token;

  const toast = useToast();

  const account = useAccount();
  const network = useNetwork();

  const { openModal } = useModal();

  const dispatch = useDispatch();

  const [gasCost, setGasCost] = useState<bigint | null>(null);

  const [sender, setSender] = useState<Account>(account);
  const [recipient, setRecipient] = useState('');

  const { getItem } = useSecureStorage();

  const estimateGasCost = async () => {
    try {
      // @ts-ignore
      const accounts: any[] = await getItem('accounts');
      const activeAccount = Array.from(accounts).find(
        account =>
          account.address.toLowerCase() === sender.address.toLowerCase()
      );

      const provider = new JsonRpcProvider(network.provider);
      const wallet = new Wallet(activeAccount.privateKey, provider);

      const tokenContract = new Contract(token.address, erc721Abi, wallet);

      const gasEstimate = await tokenContract.safeTransferFrom.estimateGas(
        sender.address,
        '0x2B0BC5225b6bB4E6C8B1A8e0d5454198C3269b1D',
        token.id
      );
      const gasPrice = await provider.getFeeData();

      const gasCost = gasPrice.gasPrice! * gasEstimate;

      setGasCost(gasCost);
    } catch (error) {
      console.error('Error estimating gas cost: ', error);
      return;
    }
  };

  const transfer = async (): Promise<TransactionReceipt | null> => {
    // @ts-ignore
    const accounts: any[] = await getItem('accounts');
    const activeAccount = Array.from(accounts).find(
      account => account.address.toLowerCase() === sender.address.toLowerCase()
    );

    const provider = new JsonRpcProvider(network.provider);
    const wallet = new Wallet(activeAccount.privateKey, provider);

    const tokenContract = new Contract(token.address, erc721Abi, wallet);

    const tx = await tokenContract.safeTransferFrom(
      sender.address,
      recipient,
      token.id
    );

    const txReceipt = await tx.wait(1);

    dispatch(addRecipient(recipient));

    return txReceipt;
  };

  const confirm = () => {
    if (!isAddress(recipient)) {
      toast.show('Invalid address', {
        type: 'danger'
      });
      return;
    }

    openModal('NFTTransferConfirmationModal', {
      txData: {
        from: sender,
        to: recipient,
        id: token.id
      },
      estimateGasCost: gasCost,
      token: token.symbol,
      onTransfer: transfer
    });
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.goBack();

    return true;
  });

  useEffect(() => {
    if (!isFocused) return;
    const provider = new JsonRpcProvider(network.provider);

    provider.removeAllListeners('block');

    estimateGasCost();

    provider.on('block', () => {
      estimateGasCost();
    });

    return () => {
      provider.removeAllListeners();
      backHandler.remove();
    };
  }, [sender]);

  if (!isFocused) return;

  return (
    <View style={styles.container}>
      <Header token={token.symbol} />

      <Sender account={sender} onChange={setSender} hideBalance />

      <Recipient
        recipient={recipient}
        onChange={setRecipient}
        onSubmit={confirm}
      />

      <Text variant="titleMedium" style={styles.tokenIdTitle}>
        TOKEN ID
      </Text>
      <Text variant="headlineLarge" style={styles.tokenId}>
        {token.id}
      </Text>

      <Divider style={styles.divider} />

      <PastRecipients onSelect={setRecipient} />

      <Button text="Next" onPress={confirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15
  },
  tokenIdTitle: {
    textAlign: 'center',
    fontWeight: '500'
  },
  tokenId: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  divider: {
    backgroundColor: '#e0e0e0',
    marginVertical: 16
  }
});
