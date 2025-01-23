import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Button from '../Button';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function ImportNFTModal({ modal: { closeModal } }: Props) {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [tokenId, setTokenId] = useState<string | undefined>(undefined);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [tokenIdError, setTokenIdError] = useState<string | null>(null);
  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={closeModal}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">Import NFT</Text>
          <IconButton icon="close" onPress={closeModal} />
        </View>

        <View style={styles.content}>
          <View style={{ gap: 8 }}>
            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
              Address
            </Text>
            <TextInput
              value={address}
              mode="outlined"
              outlineColor={COLORS.primary}
              activeOutlineColor={COLORS.primary}
              style={{ fontSize: FONT_SIZE.md }}
              placeholder={'0x...'}
              onChangeText={setAddress}
            />
            {addressError ? (
              <Text variant="bodySmall" style={{ color: '#ef4444' }}>
                {addressError}
              </Text>
            ) : null}
          </View>

          <View style={{ gap: 8 }}>
            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
              Token ID
            </Text>
            <TextInput
              value={tokenId}
              mode="outlined"
              outlineColor={COLORS.primary}
              activeOutlineColor={COLORS.primary}
              style={{ fontSize: FONT_SIZE.md }}
              placeholder={'Enter the token id'}
              onChangeText={setTokenId}
            />
            {tokenIdError ? (
              <Text variant="bodySmall" style={{ color: '#ef4444' }}>
                {tokenIdError}
              </Text>
            ) : null}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              type="outline"
              text="Cancel"
              onPress={closeModal}
              style={styles.button}
            />
            <Button text="Import" onPress={() => null} style={styles.button} />
          </View>
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
    margin: 20,
    width: WINDOW_WIDTH * 0.9
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  content: {
    gap: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%'
  },
  button: {
    marginTop: 10,
    width: '50%'
  }
});
