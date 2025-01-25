import React from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Divider, Surface, Text, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNFTs } from '../../../../../hooks/useNFTs';

type Props = {};

function NFTs({}: Props) {
  const { openModal } = useModal();
  const { nfts } = useNFTs();

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
          placeholder="Search NFTs"
          style={{ width: '85%' }}
        />
        <Icon
          name="add"
          size={30}
          style={{ color: 'white', backgroundColor: 'blue', padding: 5 }}
          onPress={() => openModal('ImportNFTModal')}
        />
      </View>
    </Surface>
  );
}

export default NFTs;
