import { keccak256, toUtf8Bytes } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { NFT } from '../store/reducers/NFTs';
import useAccount from './scaffold-eth/useAccount';
import useNetwork from './scaffold-eth/useNetwork';

/**
 * Custom hook to retrieve imported NFTs for the current account and network.
 * It listens for changes in the Redux store and updates the NFT list accordingly.
 *
 * @returns {Object} An object containing `nfts`, the list of imported NFTs.
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

  return { nfts: importedNFTs };
}
