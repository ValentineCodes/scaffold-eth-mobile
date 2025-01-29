import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-paper';
import Button from '../../components/Button';
import { Account } from '../../store/reducers/Accounts';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {
  formatEther,
  isAddress,
  JsonRpcProvider,
  parseEther,
  TransactionReceipt,
  Wallet
} from 'ethers';
import { useModal } from 'react-native-modalfy';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { addRecipient } from '../../store/reducers/Recipients';
import { parseBalance, parseFloat } from '../../utils/helperFunctions';
import Amount from './modules/Amount';
import Header from './modules/Header';
import PastRecipients from './modules/PastRecipients';
import Recipient from './modules/Recipient';
import Sender from './modules/Sender';

export default function NetworkTokenTransfer() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const toast = useToast();

  const account = useAccount();
  const network = useNetwork();

  const { openModal } = useModal();

  const dispatch = useDispatch();

  const { balance } = useBalance({
    address: account.address
  });

  const [gasCost, setGasCost] = useState<bigint | null>(null);

  const [sender, setSender] = useState<Account>(account);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const { getItem } = useSecureStorage();

  const getGasCost = async () => {
    try {
      const provider = new JsonRpcProvider(network.provider);
      const gasPrice = await provider.getFeeData();

      const gasCost = gasPrice.gasPrice! * BigInt(21000);

      setGasCost(gasCost);
    } catch (error) {
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

    const tx = await wallet.sendTransaction({
      from: sender.address,
      to: recipient,
      value: parseEther(amount.toString())
    });

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

    if (amount.trim() && balance && gasCost && !isNaN(Number(amount))) {
      if (Number(amount) >= Number(formatEther(balance))) {
        toast.show('Insufficient amount', {
          type: 'danger'
        });
        return;
      } else if (Number(formatEther(balance - gasCost)) < Number(amount)) {
        toast.show('Insufficient amount for gas', {
          type: 'danger'
        });
        return;
      }
    }

    openModal('TransferConfirmationModal', {
      txData: {
        from: sender,
        to: recipient,
        amount: parseFloat(amount, 8),
        balance: balance
      },
      estimateGasCost: gasCost,
      token: network.currencySymbol,
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

    provider.on('block', () => {
      getGasCost();
    });

    return () => {
      provider.removeAllListeners();
      backHandler.remove();
    };
  }, [sender]);

  if (!isFocused) return;

  return (
    <View style={styles.container}>
      <Header token={network.currencySymbol} />

      <Sender
        account={sender}
        balance={
          balance !== null
            ? `${parseBalance(balance)} ${network.currencySymbol}`
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
        token={network.currencySymbol}
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
