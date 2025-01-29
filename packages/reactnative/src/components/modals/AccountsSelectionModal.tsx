import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton, Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useSelector } from 'react-redux';
import { Account } from '../../store/reducers/Accounts';
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
    onSelect(account);
    closeModal();
  };
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 20,
        width: WINDOW_WIDTH * 0.9,
        maxHeight: WINDOW_HEIGHT * 0.5
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
          Accounts
        </Text>
        <IconButton
          icon={() => (
            <Ionicons name="close-outline" size={1.5 * FONT_SIZE['xl']} />
          )}
          onPress={closeModal}
        />
      </View>

      <Divider style={{ marginTop: 8 }} />

      <ScrollView>
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
                  <Text variant="bodyLarge" style={{ fontWeight: '500' }}>
                    {account.name}
                  </Text>
                  <Text variant="bodyMedium">
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
