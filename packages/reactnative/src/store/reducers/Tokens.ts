import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { keccak256, toUtf8Bytes } from 'ethers';
import { Address } from 'viem';

export interface Token {
  address: Address;
  name: string;
  symbol: string;
}

interface TokenStore {
  [key: string]: Token[];
}

interface AddTokenPayload {
  networkId: string;
  accountAddress: string;
  token: Token;
}

interface RemoveTokenPayload {
  networkId: string;
  accountAddress: string;
  tokenAddress: Address;
}

const initialState: TokenStore = {};

// Utility function to generate a unique storage key
const getStorageKey = (networkId: string, accountAddress: string) =>
  keccak256(toUtf8Bytes(`${networkId}${accountAddress.toLowerCase()}`));

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    addToken: (state, { payload }: PayloadAction<AddTokenPayload>) => {
      const { networkId, accountAddress, token } = payload;
      const key = getStorageKey(networkId, accountAddress);

      if (!state[key]) {
        state[key] = [token]; // If key doesn't exist, create new array
      } else {
        const tokenExists = state[key].some(
          existingToken =>
            existingToken.address.toLowerCase() === token.address.toLowerCase()
        );

        if (!tokenExists) {
          state[key].push(token);
        }
      }
    },

    removeToken: (state, { payload }: PayloadAction<RemoveTokenPayload>) => {
      const { networkId, accountAddress, tokenAddress } = payload;
      const key = getStorageKey(networkId, accountAddress);

      if (state[key]) {
        state[key] = state[key].filter(
          token => token.address.toLowerCase() !== tokenAddress.toLowerCase()
        );

        if (state[key].length === 0) {
          delete state[key]; // Remove empty arrays from state
        }
      }
    }
  }
});

export const { addToken, removeToken } = tokenSlice.actions;
export default tokenSlice.reducer;
