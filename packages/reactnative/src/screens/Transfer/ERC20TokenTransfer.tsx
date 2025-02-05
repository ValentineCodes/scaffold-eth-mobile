import {
  useIsFocused,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import {
  Contract,
  formatUnits,
  isAddress,
  JsonRpcProvider,
  parseUnits,
  TransactionReceipt,
  Wallet
} from 'ethers';
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Divider } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { erc20Abi } from 'viem';
import Button from '../../components/Button';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import { Account } from '../../store/reducers/Accounts';
import { addRecipient } from '../../store/reducers/Recipients';
import { parseFloat } from '../../utils/helperFunctions';
import Amount from './modules/Amount';
import Header from './modules/Header';
import PastRecipients from './modules/PastRecipients';
import Recipient from './modules/Recipient';
import Sender from './modules/Sender';

export default function ERC20TokenTransfer() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const route = useRoute();

  // @ts-ignore
  const token = route.params.token;

  const { tokenMetadata } = useTokenMetadata({ token: token.address });
  const { balance } = useTokenBalance({ token: token.address });

  const toast = useToast();

  const account = useAccount();
  const network = useNetwork();

  const { openModal } = useModal();

  const dispatch = useDispatch();

  const [gasCost, setGasCost] = useState<bigint | null>(null);

  const [sender, setSender] = useState<Account>(account);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

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

      const tokenContract = new Contract(token.address, erc20Abi, wallet);

      const gasEstimate = await tokenContract.transfer.estimateGas(
        '0x2B0BC5225b6bB4E6C8B1A8e0d5454198C3269b1D',
        parseUnits('0', 18)
      );
      const feeData = await provider.getFeeData();

      const gasCost = feeData.gasPrice! * gasEstimate;

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

    const tokenContract = new Contract(token.address, erc20Abi, wallet);

    const tx = await tokenContract.transfer(
      recipient,
      parseUnits(amount, tokenMetadata?.decimals)
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

    if (isNaN(Number(amount)) || Number(amount) < 0) {
      toast.show('Invalid amount', {
        type: 'danger'
      });
      return;
    }

    openModal('TransferConfirmationModal', {
      txData: {
        from: sender,
        to: recipient,
        amount: parseFloat(amount, 8),
        balance: balance
      },
      estimateGasCost: gasCost,
      token: tokenMetadata?.symbol,
      isNativeToken: true,
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

    provider.removeAllListeners();

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
      <Header token={tokenMetadata?.symbol} />

      <Sender
        account={sender}
        balance={
          tokenMetadata && balance
            ? parseFloat(
                formatUnits(balance, tokenMetadata?.decimals),
                4
              ).toString()
            : null
        }
        onChange={setSender}
      />

      <Recipient
        recipient={recipient}
        onChange={setRecipient}
        onSubmit={confirm}
      />

      <Amount
        amount={amount}
        token={tokenMetadata?.symbol}
        balance={balance}
        gasCost={gasCost}
        onChange={setAmount}
        onConfirm={confirm}
      />

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
  divider: {
    backgroundColor: '#e0e0e0',
    marginVertical: 16
  }
});
