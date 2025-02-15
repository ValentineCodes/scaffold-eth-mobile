import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Divider, IconButton, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import useWallet from '../../hooks/useWallet';
import {
  Account,
  addAccount,
  switchAccount
} from '../../store/reducers/Accounts';
import { Wallet } from '../../types/wallet';
import { COLORS } from '../../utils/constants';
import { truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Blockie from '../Blockie';
import Button from '../Button';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function AccountsModal({ modal: { closeModal } }: Props) {
  const dispatch = useDispatch();
  const toast = useToast();
  const { importWallet } = useWallet();
  const { getItem, saveItem } = useSecureStorage();

  const accounts: Account[] = useSelector((state: any) => state.accounts);
  const connectedAccount = useAccount();

  const { openModal } = useModal();

  const handleAccountSelection = (account: string) => {
    if (account !== connectedAccount.address) {
      dispatch(switchAccount(account));
      closeModal();
    }
  };

  const createAccount = async () => {
    const mnemonic = (await getItem('seedPhrase')) as string;
    let newAccount;

    for (let i = 0; i < Infinity; i++) {
      const wallet = importWallet(mnemonic, i);

      if (!accounts.find(account => account.address == wallet.address)) {
        newAccount = {
          address: wallet.address,
          privateKey: wallet.privateKey
        };
        break;
      }
    }

    if (!newAccount) {
      toast.show('Failed to create account!', { type: 'danger' });
      return;
    }

    const createdAccounts = (await getItem('accounts')) as Wallet[];
    await saveItem(
      'accounts',
      JSON.stringify([
        ...createdAccounts,
        { privateKey: newAccount.privateKey, address: newAccount.address }
      ])
    );

    dispatch(addAccount({ address: newAccount.address, isImported: false }));
    dispatch(switchAccount(newAccount.address));
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge">Accounts</Text>
        <IconButton icon="close" onPress={closeModal} />
      </View>

      <Divider />

      <ScrollView style={styles.scrollView}>
        {accounts.map((account, index) => (
          <Pressable
            key={account.address}
            style={[
              styles.accountItem,
              index !== accounts.length - 1 && styles.accountDivider
            ]}
            onPress={() => handleAccountSelection(account.address)}
          >
            <View style={styles.accountInfo}>
              <Blockie address={account.address} size={1.7 * FONT_SIZE.xl} />
              <View style={styles.accountDetails}>
                <Text variant="titleMedium">{account.name}</Text>
                <Text variant="bodyMedium">
                  {truncateAddress(account.address)}
                </Text>
              </View>
            </View>
            {account.isConnected && (
              <IconButton
                icon="check-circle"
                iconColor={COLORS.primary}
                size={24}
              />
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button text="Create" onPress={createAccount} style={styles.button} />
        <Button
          type="outline"
          text="Import"
          onPress={() => {
            openModal('ImportAccountModal');
          }}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 20,
    width: WINDOW_WIDTH * 0.9
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  scrollView: {
    maxHeight: Dimensions.get('window').height / 4.8
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  accountDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5'
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  accountDetails: {
    gap: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16
  },
  button: {
    flex: 1
  }
});
