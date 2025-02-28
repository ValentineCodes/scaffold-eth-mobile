import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useNetwork } from '../../hooks/scaffold-eth';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Button from '../buttons/CustomButton';

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
  const connectedNetwork = useNetwork();

  const openExplorer = () => {
    Linking.openURL(`${connectedNetwork.blockExplorer}/tx/${hash}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: FONT_SIZE['xl'], ...globalStyles.text }}>
          {isError ? 'Transaction Failed' : 'Transaction Sent'}
        </Text>
        <Ionicons
          name="close-outline"
          size={FONT_SIZE['xl'] * 1.7}
          onPress={closeModal}
        />
      </View>

      <View style={styles.content}>
        <IconButton
          icon={isError ? 'close-circle' : 'check-circle'}
          size={FONT_SIZE['xl'] * 4}
          iconColor={isError ? COLORS.error : COLORS.primary}
        />
        <Text style={styles.message}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    width: WINDOW_WIDTH * 0.9
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
    textAlign: 'center',
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  },
  button: {
    marginTop: 10
  }
});
