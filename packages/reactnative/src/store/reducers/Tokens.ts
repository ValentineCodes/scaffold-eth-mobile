import { createSlice } from '@reduxjs/toolkit';
import { keccak256, toUtf8Bytes } from 'ethers';
import { Address } from 'viem';

export interface Token {
  address: Address;
  name: string;
  symbol: string;
}

export interface TokenStore {
  [key: string]: Token[];
}

const initialState: TokenStore = {};

export const tokenSlice = createSlice({
  name: 'TOKENS',
  initialState,
  reducers: {
    addToken: (state, action) => {
      const { networkId, accountAddress, token } = action.payload;

      const tokenMetadata = {
        address: token.address,
        name: token.name,
        symbol: token.symbol
      };

      const key = keccak256(
        toUtf8Bytes(`${networkId}${accountAddress.toLowerCase()}`)
      );

      return {
        ...state,
        [key]: !state[key] ? [tokenMetadata] : [...state[key], tokenMetadata]
      };
    },
    removeToken: (state, action) => {
      const { networkId, accountAddress, tokenAddress } = action.payload;

      const key = keccak256(
        toUtf8Bytes(`${networkId}${accountAddress.toLowerCase()}`)
      );

      state[key] = state[key].filter(
        token => token.address.toLowerCase() !== tokenAddress.toLowerCase()
      );

      return state;
    }
  }
});

export const { addToken, removeToken } = tokenSlice.actions;

export default tokenSlice.reducer;
