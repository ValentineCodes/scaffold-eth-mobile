import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Network } from '../../store/reducers/Networks';
import { COLORS } from '../../utils/constants';
import Button from '../Button';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      hash: string;
      isError?: boolean;
    };
  };
};

export default function TxReceiptModal({
  modal: {
    closeModal,
    params: { hash, isError }
  }
}: Props) {
  const connectedNetwork: Network = useSelector((state: any) =>
    state.networks.find((network: Network) => network.isConnected)
  );

  const openExplorer = () => {
    Linking.openURL(`${connectedNetwork.blockExplorer}/tx/${hash}`);
  };

  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={closeModal}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">
            {isError ? 'Transaction Failed' : 'Transaction Sent'}
          </Text>
          <IconButton icon="close" onPress={closeModal} />
        </View>

        <View style={styles.content}>
          <IconButton
            icon={isError ? 'close-circle' : 'check-circle'}
            size={64}
            iconColor={isError ? COLORS.error : COLORS.primary}
          />
          <Text variant="bodyLarge" style={styles.message}>
            {isError
              ? 'Something went wrong while sending your transaction.'
              : 'Your transaction has been sent to the network.'}
          </Text>
          {!isError && (
            <Button
              text="View on Explorer"
              onPress={openExplorer}
              style={styles.button}
            />
          )}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  content: {
    alignItems: 'center',
    gap: 16
  },
  message: {
    textAlign: 'center'
  },
  button: {
    marginTop: 10
  }
});
