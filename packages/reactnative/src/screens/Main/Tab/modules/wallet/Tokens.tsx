import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Divider, Surface, Text, TextInput } from 'react-native-paper';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import Token from '../../../../../components/asset/Token';
import { useTokens } from '../../../../../hooks/useTokens';

type Props = {};

function Tokens({}: Props) {
  const { openModal } = useModal();
  const { tokens } = useTokens();
  const navigation = useNavigation();

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

      <FlatList
        data={tokens}
        keyExtractor={item => item.address}
        renderItem={({ item }) => (
          <Token
            address={item.address}
            name={item.name}
            symbol={item.symbol}
            onPress={() => navigation.navigate('TokenDetails', { token: item })}
          />
        )}
      />
    </Surface>
  );
}

export default Tokens;
