import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { IconButton, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Blockie from '../../../components/Blockie';
import { Account } from '../../../store/reducers/Accounts';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  account: Account;
  balance?: string | null;
  hideBalance?: boolean;
  onChange: (account: Account) => void;
};

export default function Sender({
  account,
  balance,
  hideBalance,
  onChange
}: Props) {
  const accounts: Account[] = useSelector((state: any) => state.accounts);

  const { openModal } = useModal();

  const selectAccount = () => {
    if (accounts.length > 1) {
      openModal('AccountsSelectionModal', {
        selectedAccount: account.address,
        onSelect: (account: Account) => onChange(account)
      });
    }
  };
  return (
    <View style={styles.container}>
      <Text variant="titleMedium">From:</Text>

      <TouchableOpacity
        onPress={selectAccount}
        disabled={accounts.length === 1}
        style={[
          styles.accountContainer,
          { backgroundColor: accounts.length === 1 ? '#f5f5f5' : '#fff' }
        ]}
      >
        <View style={styles.accountInfo}>
          <Blockie address={account.address} size={1.8 * FONT_SIZE['xl']} />

          <View style={styles.accountDetails}>
            <Text variant="titleMedium">{account.name}</Text>
            {!hideBalance && (
              <Text variant="bodyMedium">Balance: {balance?.toString()}</Text>
            )}
          </View>
        </View>

        {accounts.length > 1 && <IconButton icon="chevron-down" size={24} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 10,
    marginTop: 8
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  accountDetails: {
    marginLeft: 8,
    width: '75%'
  }
});
