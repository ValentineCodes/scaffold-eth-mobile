import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { Security } from '../../types/security';
import { WINDOW_WIDTH } from '../../utils/styles';
import Button from '../Button';
import PasswordInput from '../forms/PasswordInput';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function ChangePasswordModal({ modal: { closeModal } }: Props) {
  const toast = useToast();
  const { saveItem, getItem } = useSecureStorage();

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const change = async () => {
    try {
      const security = (await getItem('security')) as Security;

      if (!password.current || !password.new || !password.confirm) {
        toast.show('Password cannot be empty!', { type: 'warning' });
        return;
      }

      if (password.new.length < 8) {
        toast.show('Password must be at least 8 characters', {
          type: 'warning'
        });
        return;
      }

      if (password.current.trim() !== security.password) {
        toast.show('Incorrect password!', { type: 'warning' });
        return;
      }

      if (password.current.trim() === password.new.trim()) {
        toast.show('Cannot use current password', { type: 'warning' });
        return;
      }

      if (password.new.trim() !== password.confirm.trim()) {
        toast.show('Passwords do not match!', { type: 'warning' });
        return;
      }

      await saveItem(
        'security',
        JSON.stringify({ ...security, password: password.new.trim() })
      );

      closeModal();
      toast.show('Password Changed Successfully', { type: 'success' });
    } catch (error) {
      toast.show('Failed to change password', { type: 'danger' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <PasswordInput
          label="Current Password"
          value={password.current}
          infoText={
            password.current.length < 8 && 'Must be at least 8 characters'
          }
          onChange={value => setPassword(prev => ({ ...prev, current: value }))}
          onSubmit={change}
        />
        <PasswordInput
          label="New Password"
          value={password.new}
          infoText={password.new.length < 8 && 'Must be at least 8 characters'}
          onChange={value => setPassword(prev => ({ ...prev, new: value }))}
          onSubmit={change}
        />
        <PasswordInput
          label="Confirm Password"
          value={password.confirm}
          infoText={
            password.confirm.length < 8 && 'Must be at least 8 characters'
          }
          onChange={value => setPassword(prev => ({ ...prev, confirm: value }))}
          onSubmit={change}
        />

        <Button text="Change Password" onPress={change} style={styles.button} />
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
  content: {
    gap: 16
  },
  button: {
    marginTop: 10
  }
});
