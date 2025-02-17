import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { WINDOW_WIDTH } from '../../utils/styles';
import Button from '../Button';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      icon?: JSX.Element;
      title: string;
      subTitle: string;
      okText?: string;
      cancelText?: string;
      isOkLoading?: boolean;
      isCancelLoading?: boolean;
      onAccept: () => void;
    };
  };
};

export default function ConsentModal({
  modal: {
    closeModal,
    params: {
      icon,
      title,
      subTitle,
      okText,
      cancelText,
      isOkLoading,
      isCancelLoading,
      onAccept
    }
  }
}: Props) {
  const handleAcceptance = () => {
    closeModal();
    onAccept();
  };
  return (
    <View style={styles.container}>
      {icon || (
        <IconButton
          icon="alert"
          size={WINDOW_WIDTH * 0.17}
          iconColor={COLORS.primary}
        />
      )}
      <Text variant="headlineMedium" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        {subTitle}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          type="outline"
          text={cancelText || 'Cancel'}
          onPress={closeModal}
          loading={isCancelLoading}
          style={styles.button}
        />
        <Button
          text={okText || 'Ok'}
          onPress={handleAcceptance}
          loading={isOkLoading}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 28,
    margin: 20,
    alignItems: 'center',
    gap: 8
  },
  content: {
    alignItems: 'center',
    gap: 16
  },
  title: {
    color: COLORS.primary,
    textAlign: 'center',
    ...globalStyles.textSemiBold
  },
  subtitle: {
    textAlign: 'center',
    ...globalStyles.text
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
    width: '100%'
  },
  button: {
    flex: 1
  }
});
