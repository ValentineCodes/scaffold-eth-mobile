import React from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Surface, Text } from 'react-native-paper';
import { useNFTs } from '../../hooks/useNFTs';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import NFT from '../Main/Tab/modules/wallet/modules/NFT';

type Props = {};

function NFTs({}: Props) {
  const { openModal } = useModal();
  const { nfts } = useNFTs();

  return (
    <Surface style={{ paddingTop: 75, padding: 2 }}>
      <Pressable
        onPress={() => openModal('ImportNFTModal')}
        style={styles.importNFTBtnContainer}
      >
        <Text style={styles.importNFTBtn}>Import NFT</Text>
      </Pressable>

      <FlatList
        data={nfts}
        keyExtractor={item => item.address}
        renderItem={({ item }) => {
          return <NFT nft={item} />;
        }}
      />
    </Surface>
  );
}

export default NFTs;

const styles = StyleSheet.create({
  importNFTBtnContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10
  },
  importNFTBtn: {
    fontSize: FONT_SIZE['lg'],
    fontWeight: 'bold',
    color: COLORS.primary
  }
});
