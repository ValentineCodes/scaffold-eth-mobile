import { keccak256, toUtf8Bytes } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount, useNetwork } from '.';
import { NFT } from '../../store/reducers/NFTs';

/**
 * Checks if an NFT already exists in the store for the given address and token ID.
 *
 * @param nftsState - The NFT store state from Redux.
 * @param networkId - The current network ID.
 * @param accountAddress - The user's account address.
 * @param nftAddress - The address of the NFT contract.
 * @param tokenId - The token ID of the NFT.
 * @returns {boolean} - Returns true if the NFT exists, otherwise false.
 */
const nftExists = (
  nftsState: Record<string, NFT[]>,
  networkId: number,
  accountAddress: string,
  nftAddress: string,
  tokenId: number
): boolean => {
  const key = keccak256(
    toUtf8Bytes(`${networkId}-${accountAddress.toLowerCase()}`)
  );

  if (!nftsState[key]) return false;

  const nftCollection = nftsState[key].find(
    n => n.address.toLowerCase() === nftAddress.toLowerCase()
  );

  if (!nftCollection) return false;

  console.log(nftCollection.tokens);
  return nftCollection.tokens.some(t => t.id == tokenId);
};

/**
 * Custom hook to retrieve imported NFTs for the current account and network.
 * It listens for changes in the Redux store and updates the NFT list accordingly.
 *
 * @returns {Object} An object containing `nfts`, the list of imported NFTs, and `nftExists` to check for token existence.
 */
export function useNFTs() {
  const network = useNetwork();
  const account = useAccount();

  const nftsState = useSelector((state: any) => state.nfts);
  const [importedNFTs, setImportedNFTs] = useState<NFT[]>([]);

  // Compute the key based on the network ID and account address
  const storageKey = useMemo(() => {
    if (!network.id || !account.address) return null;
    return keccak256(
      toUtf8Bytes(`${network.id}-${account.address.toLowerCase()}`)
    );
  }, [network.id, account.address]);

  // Fetch NFTs based on the computed storage key
  useEffect(() => {
    if (!storageKey) return;
    setImportedNFTs(nftsState[storageKey] || []);
  }, [storageKey, nftsState]);

  return {
    nfts: importedNFTs,
    nftExists: (nftAddress: string, tokenId: number) =>
      nftExists(nftsState, network.id, account.address, nftAddress, tokenId)
  };
}
