import React from "react";
import Modal from "react-native-modal";
// @ts-ignore
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import { FONT_SIZE } from "../../../utils/styles";
import { truncateAddress } from "../../../utils/helperFunctions";
import { useSelector } from "react-redux";
import { Account } from "../../../store/reducers/Accounts";
import Blockie from "../../../components/Blockie";
import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Text, Divider, IconButton } from "react-native-paper";
import { COLORS } from "../../../utils/constants";

type Props = {
  isVisible: boolean;
  selectedAccount: string;
  onClose: () => void;
  onSelect: (account: Account) => void;
};

export default function AccountsModal({
  isVisible,
  selectedAccount,
  onClose,
  onSelect,
}: Props) {
  const accounts: Account[] = useSelector((state) => state.accounts);

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInDown"
      animationOut="slideOutUp"
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View style={{ backgroundColor: 'white', borderRadius: 30, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
            Accounts
          </Text>
          <IconButton
            icon={() => <Ionicons name="close-outline" size={1.5 * FONT_SIZE["xl"]} />}
            onPress={onClose}
          />
        </View>

        <Divider style={{ marginTop: 8 }} />

        <ScrollView style={{ maxHeight: Dimensions.get("window").height / 4.8 }}>
          {accounts.map((account, index) => (
            <TouchableOpacity
              key={account.address}
              activeOpacity={0.4}
              onPress={() => onSelect(account)}
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
                    size={1.7 * FONT_SIZE["xl"]}
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
                    size={1.2 * FONT_SIZE["xl"]}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}
