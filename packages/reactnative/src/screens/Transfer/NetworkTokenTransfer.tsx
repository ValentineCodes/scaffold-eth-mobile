import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  formatEther,
  isAddress,
  JsonRpcProvider,
  parseEther,
  TransactionReceipt,
  Wallet
} from 'ethers';
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Divider } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { Account } from '../../store/reducers/Accounts';
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

  const [gasCost, setGasCost] = useState<bigint | null>(null);

  const [sender, setSender] = useState<Account>(account);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const { balance } = useBalance({
    address: sender.address
  });

  const { getItem } = useSecureStorage();

  const estimateGasCost = async () => {
    try {
      const provider = new JsonRpcProvider(network.provider);
      const feeData = await provider.getFeeData();

      const gasCost = feeData.gasPrice! * BigInt(21000);

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

    provider.off('block');

    estimateGasCost();

    provider.on('block', () => {
      estimateGasCost();
    });

    return () => {
      provider.off('block');
      backHandler.remove();
    };
  }, []);

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
        isNativeToken
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
