import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { WINDOW_WIDTH } from '../../utils/styles';
import Button from '../buttons/CustomButton';

export interface ConsentModalParams {
  icon?: JSX.Element;
  title: string;
  subTitle: string;
  okText?: string;
  cancelText?: string;
  isOkLoading?: boolean;
  isCancelLoading?: boolean;
  iconColor?: string;
  titleStyle?: TextStyle;
  subTitleStyle?: TextStyle;
  onAccept: () => void;
}
type Props = {
  modal: {
    closeModal: () => void;
    params: ConsentModalParams;
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
      iconColor,
      titleStyle,
      subTitleStyle,
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
          iconColor={iconColor || COLORS.primary}
        />
      )}
      <Text variant="headlineMedium" style={[styles.title, titleStyle]}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={[styles.subtitle, subTitleStyle]}>
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
