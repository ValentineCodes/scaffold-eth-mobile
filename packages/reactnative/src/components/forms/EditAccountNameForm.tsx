import React, { useState } from 'react';
import { View } from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Account, changeName } from '../../store/reducers/Accounts';
import { COLORS } from '../../utils/constants';

type Props = {
  close: () => void;
};

export default function EditAccountNameForm({ close }: Props) {
  const dispatch = useDispatch();

  const accounts: Account[] = useSelector(state => state.accounts);
  const connectedAccount: Account = useSelector(state =>
    state.accounts.find((account: Account) => account.isConnected)
  );

  const [name, setName] = useState(connectedAccount.name);
  const [error, setError] = useState('');

  const editName = () => {
    if (name.trim().length === 0) {
      setError('Account name cannot be empty');
      return;
    }
    if (accounts.find(account => account.name == name) !== undefined) {
      setError('Account name already exists');
      return;
    }
    dispatch(changeName({ address: connectedAccount.address, newName: name }));
    close();
  };

  const handleInputChange = (value: string) => {
    setName(value);
    if (error) {
      setError('');
    }
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <IconButton icon="close" iconColor="red" size={28} onPress={close} />

        <TextInput
          placeholder="New account name"
          value={name}
          onChangeText={handleInputChange}
          onSubmitEditing={editName}
          mode="outlined"
          style={{ width: '60%' }}
          outlineColor={COLORS.primary}
          activeOutlineColor={COLORS.primary}
          selectionColor={COLORS.primary}
          selectTextOnFocus
        />

        <IconButton
          icon="check"
          iconColor={COLORS.primary}
          size={20}
          onPress={editName}
        />
      </View>

      {error && (
        <Text variant="bodySmall" style={{ color: 'red' }}>
          {error}
        </Text>
      )}
    </View>
  );
}
