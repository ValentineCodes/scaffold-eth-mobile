import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { IconButton, Text } from 'react-native-paper';
import BackButton from '../../components/buttons/BackButton';
import { useNFTs } from '../../hooks/scaffold-eth';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import NFT from './modules/NFT';

type Props = {};

function NFTs({}: Props) {
  const { openModal } = useModal();
  const { nfts } = useNFTs();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton />
          <Text variant="titleLarge" style={styles.headerTitle}>
            NFTs
          </Text>
        </View>

        <IconButton
          icon="cloud-download"
          size={FONT_SIZE.xl * 1.7}
          iconColor={COLORS.primary}
          onPress={() => openModal('ImportNFTModal')}
        />
      </View>

      <FlatList
        data={nfts}
        keyExtractor={item => item.address}
        renderItem={({ item }) => {
          return <NFT nft={item} />;
        }}
      />
    </View>
  );
}

export default NFTs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: { ...globalStyles.textSemiBold },
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
