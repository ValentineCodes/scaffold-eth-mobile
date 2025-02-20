import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';
import Button from '../../buttons/CustomButton';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
};

export default function Success({ isVisible, onClose, onViewDetails }: Props) {
  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <Image
            source={require('../../../assets/images/success_transfer.png')}
            style={styles.image}
          />
          <Text variant="headlineSmall" style={styles.successText}>
            Successfully Sent!
          </Text>
          <Text variant="bodyLarge" style={styles.message}>
            Your crypto was sent successfully. You can view transaction below.
          </Text>
          <Button text="View Details" onPress={onViewDetails} />
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
  successText: {
    color: COLORS.primary,
    ...globalStyles.textMedium
  },
  message: {
    textAlign: 'center',
    ...globalStyles.text
  }
});
