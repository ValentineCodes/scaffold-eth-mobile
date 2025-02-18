import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';
import { NFTToken, NFT as NFTType } from '../../../store/reducers/NFTs';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import NFTCard from './NFTCard';

type Props = {
  nft: NFTType;
};

export default function NFT({ nft }: Props) {
  const [expanded, setExpanded] = useState(true);
  return (
    <List.Accordion
      title={`${nft.name} (${nft.symbol})`}
      titleStyle={globalStyles.textMedium}
      style={{ backgroundColor: COLORS.lightGray }}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
    >
      <View style={styles.nftContainer}>
        {nft.tokens.map((token: NFTToken) => (
          <NFTCard
            key={token.id.toString()}
            token={{
              address: nft.address,
              name: nft.name,
              symbol: nft.symbol,
              ...token
            }}
          />
        ))}
      </View>
    </List.Accordion>
  );
}

const styles = StyleSheet.create({
  nftContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 10,
    marginTop: 10
  }
});
