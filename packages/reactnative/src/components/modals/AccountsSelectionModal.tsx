import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useSelector } from 'react-redux';
import { Account } from '../../store/reducers/Accounts';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/styles';
import Blockie from '../Blockie';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      selectedAccount: string;
      onSelect: (account: Account) => void;
    };
  };
};

export default function AccountsSelectionModal({
  modal: {
    closeModal,
    params: { selectedAccount, onSelect }
  }
}: Props) {
  const accounts: Account[] = useSelector((state: any) => state.accounts);

  const handleSelection = (account: Account) => {
    closeModal();
    onSelect(account);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={globalStyles.textMedium}>
          Accounts
        </Text>
        <Ionicons
          name="close-outline"
          size={FONT_SIZE['xl'] * 1.7}
          onPress={closeModal}
        />
      </View>

      <Divider style={{ marginTop: 8 }} />

      <ScrollView style={styles.scrollView}>
        {accounts.map((account, index) => (
          <TouchableOpacity
            key={account.address}
            activeOpacity={0.4}
            onPress={() => handleSelection(account)}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                borderBottomWidth: index === accounts.length - 1 ? 0 : 1,
                borderBottomColor: '#E5E5E5'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Blockie
                  address={account.address}
                  size={1.7 * FONT_SIZE['xl']}
                />
                <View style={{ marginLeft: 16 }}>
                  <Text variant="titleMedium" style={globalStyles.textMedium}>
                    {account.name}
                  </Text>
                  <Text variant="bodyMedium" style={globalStyles.text}>
                    {truncateAddress(account.address)}
                  </Text>
                </View>
              </View>
              {selectedAccount === account.address && (
                <Ionicons
                  name="checkmark-done"
                  color={COLORS.primary}
                  size={1.2 * FONT_SIZE['xl']}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    width: WINDOW_WIDTH * 0.9,
    maxHeight: WINDOW_HEIGHT * 0.5
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  scrollView: {
    maxHeight: WINDOW_HEIGHT / 4.8
  }
});
