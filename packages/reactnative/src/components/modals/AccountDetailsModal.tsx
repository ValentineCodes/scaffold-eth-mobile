import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import { Account, removeAccount } from '../../store/reducers/Accounts';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Blockie from '../Blockie';
import CustomButton from '../Button';
import CopyableText from '../CopyableText';
import EditAccountNameForm from '../forms/EditAccountNameForm';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function AccountDetailsModal({ modal: { closeModal } }: Props) {
  const dispatch = useDispatch();

  const accounts: Account[] = useSelector((state: any) => state.accounts);
  const connectedAccount: Account = useAccount();

  const { openModal } = useModal();

  const [isEditingAccountName, setIsEditingAccountName] = useState(false);

  const handleAccountRemoval = () => {
    closeModal();
    dispatch(removeAccount(connectedAccount.address));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Blockie
          address={connectedAccount.address}
          size={2.5 * FONT_SIZE['xl']}
        />
        {isEditingAccountName ? (
          <EditAccountNameForm close={() => setIsEditingAccountName(false)} />
        ) : (
          <View style={styles.nameContainer}>
            <Text variant="titleLarge" style={globalStyles.textMedium}>
              {connectedAccount.name}
            </Text>
            <Ionicons
              name="pencil"
              size={FONT_SIZE['xl']}
              onPress={() => setIsEditingAccountName(true)}
            />
          </View>
        )}

        <QRCode value={connectedAccount.address} size={12 * FONT_SIZE['xl']} />

        <CopyableText
          value={connectedAccount.address}
          containerStyle={styles.addressContainer}
          textStyle={styles.addressText}
        />

        <CustomButton
          text="Show private key"
          onPress={() => openModal('PrivateKeyModal')}
        />

        {accounts.length > 1 && (
          <CustomButton
            type="outline"
            text="Remove account"
            onPress={handleAccountRemoval}
            style={{ backgroundColor: COLORS.error }}
            labelStyle={{ color: 'white' }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 30,
    width: WINDOW_WIDTH * 0.9
  },
  content: {
    alignItems: 'center',
    gap: 16
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 25
  },
  addressText: {
    fontSize: FONT_SIZE['xl'],
    ...globalStyles.text
  }
});
