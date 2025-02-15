import { keccak256, toUtf8Bytes } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NFT } from '../store/reducers/NFTs';
import useAccount from './scaffold-eth/useAccount';
import useNetwork from './scaffold-eth/useNetwork';

export function useNFTs() {
  // @ts-ignore
  const state = useSelector(state => state.nfts);

  const network = useNetwork();
  const account = useAccount();

  const [importedNFTs, setImportedNFTs] = useState<NFT[]>();

  function getNFTs() {
    const key = keccak256(
      toUtf8Bytes(`${network.id}${account.address.toLowerCase()}`)
    );
    setImportedNFTs(state.nfts[key]);
  }

  useEffect(() => {
    getNFTs();
  }, [network, account, state]);

  return {
    nfts: importedNFTs
  };
}
