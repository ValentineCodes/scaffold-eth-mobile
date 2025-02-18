import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import { Account, changeName } from '../../store/reducers/Accounts';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';

type Props = {
  close: () => void;
};

export default function EditAccountNameForm({ close }: Props) {
  const dispatch = useDispatch();

  const accounts: Account[] = useSelector(state => state.accounts);
  const connectedAccount: Account = useAccount();

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
        <Ionicons name="close-outline" size={28} color="red" onPress={close} />
        <TextInput
          placeholder="New account name"
          value={name}
          onChangeText={handleInputChange}
          onSubmitEditing={editName}
          mode="outlined"
          style={{ width: '60%' }}
          outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
          contentStyle={globalStyles.text}
          outlineColor={COLORS.primary}
          activeOutlineColor={COLORS.primary}
          selectionColor={COLORS.primaryLight}
          selectTextOnFocus
        />

        <Ionicons
          name="checkmark-done"
          size={20}
          color={COLORS.primary}
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
