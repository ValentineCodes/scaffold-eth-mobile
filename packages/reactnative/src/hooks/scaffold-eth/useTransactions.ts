import { keccak256, toUtf8Bytes } from 'ethers';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useNetwork } from '.';
import {
  addTransaction,
  removeTransaction,
  Transaction
} from '../../store/reducers/Transactions';

/**
 * Generates a unique storage key based on network ID and account address.
 * @param networkId - The ID of the blockchain network.
 * @param accountAddress - The user's wallet address.
 * @returns A unique hash representing the storage key.
 */
const getStorageKey = (networkId: number, accountAddress: string): string =>
  keccak256(toUtf8Bytes(`${networkId}${accountAddress.toLowerCase()}`));

/**
 * Hook to manage transactions within the Redux store.
 * Provides functions to add and remove transactions for the current account and network.
 *
 * @returns An object containing:
 *  - `transactions`: List of transactions for the current account and network.
 *  - `addTx`: Function to add a new transaction.
 *  - `removeTx`: Function to remove a transaction by its hash.
 */
export function useTransactions() {
  const dispatch = useDispatch();
  const network = useNetwork();
  const account = useAccount();

  // Select transactions state from Redux store
  const transactionsState = useSelector((state: any) => state.transactions);

  /**
   * Memoized computation of the storage key based on the network and account.
   * Ensures that the key is only recalculated when dependencies change.
   */
  const storageKey = useMemo(() => {
    if (!network.id || !account.address) return null;
    return getStorageKey(network.id, account.address);
  }, [network.id, account.address]);

  /**
   * Retrieves transactions for the current account and network.
   * Defaults to an empty array if no transactions are found.
   */
  const transactions: Transaction[] = storageKey
    ? transactionsState[storageKey] || []
    : [];

  /**
   * Adds a new transaction to the Redux store.
   *
   * @param transaction - The transaction object to be added.
   */
  const addTx = (transaction: Transaction) => {
    if (!storageKey) return;
    dispatch(
      addTransaction({
        networkId: network.id.toString(),
        accountAddress: account.address,
        transaction
      })
    );
  };

  /**
   * Removes a transaction from the Redux store by its hash.
   *
   * @param hash - The transaction hash to be removed.
   */
  const removeTx = (hash: string) => {
    if (!storageKey) return;
    dispatch(
      removeTransaction({
        networkId: network.id,
        accountAddress: account.address,
        hash
      })
    );
  };

  return { transactions, addTx, removeTx };
}
