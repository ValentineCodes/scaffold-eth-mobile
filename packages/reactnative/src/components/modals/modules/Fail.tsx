import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import globalStyles from '../../../styles/globalStyles';
import { FONT_SIZE } from '../../../utils/styles';
import Button from '../../buttons/CustomButton';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onRetry: () => void;
};

export default function Fail({ isVisible, onClose, onRetry }: Props) {
  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <Image
            source={require('../../../assets/images/fail_icon.png')}
            style={styles.image}
          />
          <Text variant="headlineSmall" style={styles.errorText}>
            Oops...Failed!
          </Text>
          <Text variant="bodyLarge" style={styles.message}>
            Please check your internet connection and try again.
          </Text>
          <Button text="Try Again" onPress={onRetry} />
          <Button type="outline" text="Cancel" onPress={onClose} />
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 40,
    margin: 20
  },
  content: {
    padding: 20,
    alignItems: 'center',
    gap: 16
  },
  image: {
    width: Dimensions.get('window').height * 0.25,
    height: Dimensions.get('window').height * 0.25
  },
  errorText: {
    color: '#F75554',
    ...globalStyles.textMedium
  },
  message: {
    textAlign: 'center',
    ...globalStyles.text
  }
});
