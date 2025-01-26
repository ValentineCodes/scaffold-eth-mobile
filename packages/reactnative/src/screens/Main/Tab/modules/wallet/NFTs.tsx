import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Divider, List, Surface, Text, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNFTs } from '../../../../../hooks/useNFTs';
import { NFTToken } from '../../../../../store/reducers/NFTs';
import { COLORS } from '../../../../../utils/constants';
import NFT from './modules/NFT';
import NFTCard from './modules/NFTCard';

type Props = {};

function NFTs({}: Props) {
  const { openModal } = useModal();
  const { nfts } = useNFTs();

  return (
    <Surface style={{ paddingTop: 75, padding: 2 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

        <FlatList
          data={nfts}
          renderItem={({ item }) => {
            return <NFT item={item} />;
          }}
        />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  nftImage: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10
  }
});

export default NFTs;
