import { createSlice } from '@reduxjs/toolkit';
import { keccak256, toUtf8Bytes } from 'ethers';
import { Address } from 'viem';

export type TransactionType = 'transfer' | 'contract';

export interface Transaction {
  type: TransactionType;
  title: string;
  hash: string;
  value: string;
  timestamp: number;
  from: Address;
  to: Address;
  nonce: number;
  gasFee: string;
  total: string;
}

interface TransactionStore {
  [key: string]: Transaction[];
}

const initialState: TransactionStore = {};

// Utility function to generate a unique storage key
const getStorageKey = (networkId: string, accountAddress: string) =>
  keccak256(toUtf8Bytes(`${networkId}${accountAddress.toLowerCase()}`));

export const transactionsSlice = createSlice({
  name: 'TRANSACTIONS',
  initialState,
  reducers: {
    addTransaction: (state, { payload }) => {
      const { networkId, accountAddress, transaction } = payload;
      const key = getStorageKey(networkId, accountAddress);
      if (!state[key]) {
        state[key] = [];
      }
      state[key].push(transaction);
    },
    removeTransaction: (state, { payload }) => {
      const { networkId, accountAddress, transactionHash } = payload;
      const key = getStorageKey(networkId, accountAddress);
      if (state[key]) {
        state[key] = state[key].filter(tx => tx.hash !== transactionHash);
        if (state[key].length === 0) {
          delete state[key];
        }
      }
    }
  }
});

export const { addTransaction, removeTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;
