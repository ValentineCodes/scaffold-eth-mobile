import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Text } from 'react-native-paper';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useSelector } from 'react-redux';
import { Blockie } from '../../../components/scaffold-eth';
import { Account } from '../../../store/reducers/Accounts';
import globalStyles from '../../../styles/globalStyles';
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
      <Text variant="titleMedium" style={globalStyles.text}>
        From:
      </Text>

      <TouchableOpacity
        onPress={selectAccount}
        disabled={accounts.length === 1}
        style={styles.accountContainer}
      >
        <View style={styles.accountInfo}>
          <Blockie address={account.address} size={1.8 * FONT_SIZE['xl']} />

          <View style={styles.accountDetails}>
            <Text style={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}>
              {account.name}
            </Text>
            {!hideBalance && (
              <Text variant="bodyMedium" style={globalStyles.text}>
                Balance: {balance?.toString()}
              </Text>
            )}
          </View>
        </View>

        {accounts.length > 1 && (
          <Ionicons name="chevron-down-outline" size={FONT_SIZE['xl']} />
        )}
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
    padding: 12,
    marginTop: 8,
    backgroundColor: '#f5f5f5'
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
