import { keccak256, toUtf8Bytes } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NFT } from '../store/reducers/NFTs';
import useAccount from './scaffold-eth/useAccount';
import useNetwork from './scaffold-eth/useNetwork';

export function useNFTs() {
  // @ts-ignore
  const nfts = useSelector(state => state.nfts);

  const network = useNetwork();
  const account = useAccount();

  const [importedNFTs, setImportedNFTs] = useState<NFT[]>();

  function setNFTs() {
    const key = keccak256(
      toUtf8Bytes(`${network.id}${account.address.toLowerCase()}`)
    );
    setImportedNFTs(nfts[key]);
  }

  useEffect(() => {
    setNFTs();
  }, [network, account, nfts]);

  return {
    nfts: importedNFTs
  };
}
