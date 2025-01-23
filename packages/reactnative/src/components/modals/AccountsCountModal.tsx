import React, { useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import {
  Button as PaperButton,
  Surface,
  Text,
  TextInput
} from 'react-native-paper';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import Button from '../Button';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onFinish: (accountsCount: number) => void;
};

const MAX_INITIAL_ACCOUNT = 10;

export default function AccountsCountModal({
  isVisible,
  onClose,
  onFinish
}: Props) {
  const [accountsCount, setAccountsCount] = useState('1');
  const [error, setError] = useState('');

  const isAccountsCountValid = (value?: string): boolean => {
    const _accountsCount = Number(value || accountsCount);

    if (isNaN(_accountsCount)) {
      setError('Invalid count');
      return false;
    } else if (_accountsCount > MAX_INITIAL_ACCOUNT || _accountsCount < 1) {
      setError(`Initial accounts must be from 1 - ${MAX_INITIAL_ACCOUNT}`);
      return false;
    }

    return true;
  };

  const handleInputChange = (value: string) => {
    setAccountsCount(value);

    if (error) {
      setError('');
    }

    isAccountsCountValid(value);
  };

  const handleOnFinish = () => {
    if (isAccountsCountValid()) {
      onFinish(Math.floor(Number(accountsCount)));
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <Surface
        style={{
          borderRadius: 30,
          padding: 20,
          elevation: 4
        }}
      >
        <View style={{ alignItems: 'center', gap: 16 }}>
          <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
            How many accounts would you like to start with?
          </Text>

          <Text
            variant="titleMedium"
            style={{
              color: COLORS.primary,
              textAlign: 'center'
            }}
          >
            Max: 10
          </Text>

          <TextInput
            value={accountsCount}
            mode="flat"
            style={{
              backgroundColor: 'transparent',
              fontSize: 32,
              textAlign: 'center',
              width: '100%'
            }}
            underlineColor="transparent"
            activeUnderlineColor={COLORS.primary}
            onChangeText={handleInputChange}
            onSubmitEditing={handleOnFinish}
            keyboardType="number-pad"
            textColor={COLORS.primary}
            selectTextOnFocus
          />

          {error && (
            <Text variant="bodySmall" style={{ color: 'red' }}>
              {error}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              gap: 8
            }}
          >
            <PaperButton
              mode="contained-tonal"
              onPress={onClose}
              style={{
                flex: 1
              }}
            >
              Cancel
            </PaperButton>

            <Button
              text="Continue"
              onPress={handleOnFinish}
              style={{ flex: 1, borderRadius: 0 }}
            />
          </View>
        </View>
      </Surface>
    </Modal>
  );
}
