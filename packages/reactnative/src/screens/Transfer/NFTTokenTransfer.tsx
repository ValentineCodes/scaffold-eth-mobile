import {
  useIsFocused,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import {
  Contract,
  formatEther,
  isAddress,
  JsonRpcProvider,
  TransactionReceipt,
  Wallet
} from 'ethers';
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Divider, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { Address, erc721Abi } from 'viem';
import CustomButton from '../../components/buttons/CustomButton';
import {
  useAccount,
  useNetwork,
  useSecureStorage,
  useTransactions
} from '../../hooks/scaffold-eth';
import { Account } from '../../store/reducers/Accounts';
import { addRecipient } from '../../store/reducers/Recipients';
import globalStyles from '../../styles/globalStyles';
import { parseFloat } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';
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

  const { addTx } = useTransactions();

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

    // Add transaction to Redux store
    const gasFee = txReceipt?.gasUsed
      ? txReceipt.gasUsed * txReceipt.gasPrice
      : 0n;
    const transaction = {
      type: 'transfer',
      title: `${token.symbol} Transfer`,
      hash: tx.hash,
      value: parseFloat(formatEther(tx.value), 8).toString(),
      timestamp: Date.now(),
      from: tx.from as Address,
      to: tx.to as Address,
      nonce: tx.nonce,
      gasFee: parseFloat(formatEther(gasFee), 8).toString(),
      total: parseFloat(formatEther(tx.value + gasFee), 8).toString()
    };

    // @ts-ignore
    addTx(transaction);

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

    provider.off('block');

    estimateGasCost();

    provider.on('block', () => {
      estimateGasCost();
    });

    return () => {
      provider.off('block');
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
        {Number(token.id).toLocaleString('en-US')}
      </Text>

      <Divider style={styles.divider} />

      <PastRecipients onSelect={setRecipient} />

      <CustomButton text="Next" onPress={confirm} />
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
    fontSize: FONT_SIZE['xl'],
    ...globalStyles.textMedium
  },
  tokenId: {
    textAlign: 'center',
    ...globalStyles.textSemiBold
  },
  divider: {
    backgroundColor: '#e0e0e0',
    marginVertical: 16
  }
});
