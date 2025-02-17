import { createSlice } from '@reduxjs/toolkit';
import { keccak256, toUtf8Bytes } from 'ethers';
import { Address } from 'viem';

/**
 * Represents an individual NFT token.
 */
export interface NFTToken {
  id: number; // Unique identifier of the token (typically tokenId)
  uri: string; // Metadata URI of the token
}

/**
 * Represents an NFT collection (contract).
 */
export interface NFT {
  address: Address; // Contract address of the NFT collection
  name: string; // Name of the NFT collection
  symbol: string; // Symbol of the NFT collection
  tokens: NFTToken[]; // List of tokens owned by the user
}

/**
 * Represents the structure of the NFT store.
 *
 * The key is a hash of `chainId-accountAddress` to uniquely identify
 * the NFTs owned by an account on a specific blockchain.
 */
export interface NFTStore {
  [key: string]: NFT[]; // Maps a unique key to an array of NFT collections
}

/**
 * Initial state of the NFT store.
 */
const initialState: NFTStore = {};

/**
 * Redux slice for managing NFT state.
 */
export const nftSlice = createSlice({
  name: 'NFTs',
  initialState,
  reducers: {
    /**
     * Adds an NFT to the store.
     *
     * If the NFT contract doesn't exist in the store, it is added with the first token.
     * If the contract exists but the token is new, it is added to the contract's token list.
     */
    addNFT: (state, action) => {
      const { networkId, accountAddress, nft } = action.payload;
      const key = keccak256(
        toUtf8Bytes(`${networkId}-${accountAddress.toLowerCase()}`)
      );

      if (!state[key]) {
        state[key] = [];
      }

      const nftAddress = nft.address.toLowerCase();
      const token: NFTToken = { id: nft.tokenId, uri: nft.tokenURI };

      let existingNFT = state[key].find(n => n.address === nftAddress);

      if (!existingNFT) {
        // Add a new NFT collection
        state[key].push({
          address: nftAddress,
          name: nft.name,
          symbol: nft.symbol,
          tokens: [token]
        });
      } else {
        // Add a token to an existing NFT collection if it doesn't already exist
        if (!existingNFT.tokens.some(t => t.id === nft.tokenId)) {
          existingNFT.tokens.push(token);
        }
      }
    },

    /**
     * Removes an NFT token from the store.
     *
     * If the removed token was the last one in the collection, the entire collection is removed.
     * If the collection was the last one for a user, the key is removed from the store.
     */
    removeNFT: (state, action) => {
      const { networkId, accountAddress, nftAddress, tokenId } = action.payload;
      const key = keccak256(
        toUtf8Bytes(`${networkId}-${accountAddress.toLowerCase()}`)
      );
      const nftAddrLower = nftAddress.toLowerCase();

      if (!state[key]) return;

      // Find the NFT collection
      const nftIndex = state[key].findIndex(n => n.address === nftAddrLower);
      if (nftIndex === -1) return;

      // Remove the specified token
      const nft = state[key][nftIndex];
      nft.tokens = nft.tokens.filter(token => token.id !== tokenId);

      // Remove the NFT collection if it has no tokens left
      if (nft.tokens.length === 0) {
        state[key].splice(nftIndex, 1);
      }

      // Remove the key if the user has no NFTs left
      if (state[key].length === 0) {
        delete state[key];
      }
    }
  }
});

export const { addNFT, removeNFT } = nftSlice.actions;
export default nftSlice.reducer;
