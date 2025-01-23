import React from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Divider, Surface, Text, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {};

function Tokens({}: Props) {
  const { openModal } = useModal();
  return (
    <Surface style={{ paddingTop: 75, padding: 2 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 8
        }}
      >
        <TextInput
          mode="outlined"
          placeholder="Search tokens"
          style={{ width: '85%' }}
        />
        <Icon
          name="add"
          size={30}
          style={{ color: 'white', backgroundColor: 'blue', padding: 5 }}
          onPress={() => openModal('ImportTokenModal')}
        />
      </View>
    </Surface>
  );
}

export default Tokens;
