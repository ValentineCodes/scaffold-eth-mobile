import { createSlice } from '@reduxjs/toolkit';
import { keccak256, toUtf8Bytes } from 'ethers';
import { Address } from 'viem';

export interface NFTToken {
  id: number;
  uri: string;
}

export interface NFT {
  address: Address;
  name: string;
  symbol: string;
  tokens: NFTToken[];
}

export interface NFTStore {
  nfts: {
    [key: string]: NFT[];
  };
  nftIndexes: {
    [key: string]: {
      [address: Address]: number;
    };
  };
  nftTokenIndexes: {
    [key: string]: {
      [tokenId: number]: number;
    };
  };
}

const initialState: NFTStore = {
  nfts: {},
  nftIndexes: {},
  nftTokenIndexes: {}
};

export const nftSlice = createSlice({
  name: 'NFTs',
  initialState,
  reducers: {
    addNFT: (state, action) => {
      const { networkId, accountAddress, nft } = action.payload;

      const key = keccak256(
        toUtf8Bytes(`${networkId}${accountAddress.toLowerCase()}`)
      );

      const _nft = {
        address: nft.address.toLowerCase(),
        name: nft.name,
        symbol: nft.symbol,
        tokens: [
          {
            id: nft.tokenId,
            uri: nft.tokenURI
          }
        ]
      };

      const _nftToken = {
        id: nft.tokenId,
        uri: nft.tokenURI
      };

      if (!state.nfts[key]) {
        state.nfts[key] = [_nft];
        state.nftIndexes[key][nft.address.toLowerCase()] = 0;
        state.nftTokenIndexes[key][nft.tokenId] = 0;
      } else if (!state.nftIndexes[key][nft.address.toLowerCase()]) {
        state.nftIndexes[key][nft.address.toLowerCase()] = 0;
        state.nftTokenIndexes[key][nft.tokenId] = 0;
        state.nfts[key].push(_nft);
      } else {
        state.nfts[key][
          state.nftIndexes[key][nft.address.toLowerCase()]
        ].tokens.push(_nftToken);
        state.nftTokenIndexes[key][nft.tokenId] =
          state.nfts[key][state.nftIndexes[key][nft.address.toLowerCase()]]
            .tokens.length - 1;
      }

      return state;
    },
    removeNFT: (state, action) => {
      const { networkId, accountAddress, nftAddress, tokenId } = action.payload;

      const key = keccak256(
        toUtf8Bytes(`${networkId}${accountAddress.toLowerCase()}`)
      );

      const nftIndex = state.nftIndexes[key][nftAddress.toLowerCase()];
      const nftTokenIndex = state.nftTokenIndexes[key][tokenId];

      state.nfts[key][nftIndex].tokens.splice(nftTokenIndex, 1);

      if (state.nfts[key][nftIndex].tokens.length === 0) {
        state.nfts[key].splice(nftIndex, 1);
        delete state.nftIndexes[key][nftAddress.toLowerCase()];
        delete state.nftTokenIndexes[key][tokenId];
      }

      return state;
    }
  }
});

export const { addNFT, removeNFT } = nftSlice.actions;

export default nftSlice.reducer;
