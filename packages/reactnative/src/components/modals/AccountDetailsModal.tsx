import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, IconButton, Modal, Portal, Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';
import { Account, removeAccount } from '../../store/reducers/Accounts';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import Blockie from '../Blockie';
import CopyableText from '../CopyableText';
import EditAccountNameForm from '../forms/EditAccountNameForm';
import PrivateKeyModal from './PrivateKeyModal';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function AccountDetailsModal({ isVisible, onClose }: Props) {
  const dispatch = useDispatch();

  const accounts: Account[] = useSelector(state => state.accounts);
  const connectedAccount: Account = useSelector(state =>
    state.accounts.find((account: Account) => account.isConnected)
  );

  const [isEditingAccountName, setIsEditingAccountName] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [showRemoveAccountConsentModal, setShowRemoveAccountConsentModal] =
    useState(false);

  const handleAccountRemoval = () => {
    dispatch(removeAccount(connectedAccount.address));
    onClose();
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <Blockie
            address={connectedAccount.address}
            size={2.5 * FONT_SIZE['xl']}
          />
          {isEditingAccountName ? (
            <EditAccountNameForm close={() => setIsEditingAccountName(false)} />
          ) : (
            <View style={styles.nameContainer}>
              <Text variant="titleLarge">{connectedAccount.name}</Text>
              <IconButton
                icon="pencil"
                size={24}
                onPress={() => setIsEditingAccountName(true)}
              />
            </View>
          )}

          <QRCode
            value={connectedAccount.address}
            size={12 * FONT_SIZE['xl']}
          />

          <CopyableText
            value={connectedAccount.address}
            containerStyle={styles.addressContainer}
            textStyle={styles.addressText}
          />

          <Button
            mode="outlined"
            onPress={() => setShowPrivateKeyModal(true)}
            style={styles.button}
          >
            Show private key
          </Button>

          {accounts.length > 1 && (
            <Button
              mode="contained"
              onPress={() => setShowRemoveAccountConsentModal(true)}
              style={[styles.button, styles.dangerButton]}
              textColor="white"
            >
              Remove account
            </Button>
          )}
        </View>

        <PrivateKeyModal
          isVisible={showPrivateKeyModal}
          onClose={() => setShowPrivateKeyModal(false)}
        />

        <Portal>
          <Modal
            visible={showRemoveAccountConsentModal}
            onDismiss={() => setShowRemoveAccountConsentModal(false)}
            contentContainerStyle={styles.consentModal}
          >
            <View style={styles.consentContent}>
              <IconButton icon="alert" size={50} iconColor={COLORS.error} />
              <Text variant="headlineSmall" style={styles.warningText}>
                Remove account
              </Text>
              <Text variant="bodyLarge" style={styles.warningDescription}>
                This action cannot be reversed. Are you sure you want to go
                through with this?
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => setShowRemoveAccountConsentModal(false)}
                  style={styles.button}
                >
                  Not really
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAccountRemoval}
                  style={[styles.button, styles.dangerButton]}
                >
                  Yes, I'm sure
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 30
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
    fontWeight: '500',
    fontSize: FONT_SIZE['xl'],
    width: '92%'
  },
  button: {
    width: '100%',
    marginTop: 8
  },
  dangerButton: {
    backgroundColor: COLORS.error
  },
  consentModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 30
  },
  consentContent: {
    alignItems: 'center',
    gap: 16
  },
  warningText: {
    color: COLORS.error,
    textAlign: 'center'
  },
  warningDescription: {
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16
  }
});
