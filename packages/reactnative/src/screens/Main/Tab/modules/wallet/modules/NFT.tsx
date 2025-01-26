import React from 'react'
import { NFTToken, NFT as NFTType } from '../../../../../../store/reducers/NFTs'
import { List } from 'react-native-paper'
import NFTCard from './NFTCard'
import { StyleSheet, View } from 'react-native'

type Props = {
    item: NFTType
}

export default function NFT({item}: Props) {
  return (
    <List.Accordion
    title={`${item.name} (${item.symbol})`}
    onPress={() => {}}
  >
    <View style={styles.nftContainer}> 
      {item.tokens.map((token: NFTToken) => (
        <NFTCard token={token} />
      ))}
    </View>
  </List.Accordion>
  )
}

const styles = StyleSheet.create({
    nftContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    }
})