import { useCallback, useEffect, useState } from 'react';
import { Address, erc721Abi } from 'viem';
import useContractRead from './scaffold-eth/useContractRead';

/**
 * Options for the `useNFTMetadata` hook.
 */
interface UseNFTMetadataOptions {
  nft?: Address;
  tokenId?: string | number;
}

/**
 * NFT metadata.
 */
export interface NFTMetadata {
  name: string;
  symbol: string;
  tokenURI: string;
}

/**
 * Result of the `useNFTMetadata` hook.
 */
interface UseNFTMetadataResult {
  isLoading: boolean;
  error: Error | null;
  nftMetadata: NFTMetadata | null;
  getNFTMetadata: (
    nft?: Address,
    tokenId?: string | number
  ) => Promise<NFTMetadata | undefined>;
}

/**
 * Hook to retrieve metadata of a specified NFT (ERC721).
 *
 * @param {UseNFTMetadataOptions} [options] - Options including an optional NFT contract address and token ID.
 * @returns {UseNFTMetadataResult} - Loading state, error, NFT metadata, and the `getNFTMetadata` function.
 */
export function useNFTMetadata({
  nft: defaultNFT,
  tokenId: defaultTokenId
}: UseNFTMetadataOptions = {}): UseNFTMetadataResult {
  const { readContract } = useContractRead();

  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch and set metadata (name, symbol, tokenURI) for the given NFT.
   */
  const getNFTMetadata = useCallback(
    async (
      nft: Address = defaultNFT!,
      tokenId: string | number = defaultTokenId!
    ) => {
      if (!nft || tokenId === undefined) {
        setError(new Error('NFT contract address and token ID are required'));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [name, symbol, tokenURI] = (await Promise.all([
          readContract({
            address: nft,
            abi: erc721Abi,
            functionName: 'name'
          }),
          readContract({
            address: nft,
            abi: erc721Abi,
            functionName: 'symbol'
          }),
          readContract({
            address: nft,
            abi: erc721Abi,
            functionName: 'tokenURI',
            args: [tokenId]
          })
        ])) as [string, string, string];

        const metadata: NFTMetadata = {
          name,
          symbol,
          tokenURI
        };
        setNftMetadata(metadata);
        return metadata;
      } catch (err) {
        setError(err as Error);
        setNftMetadata(null);
      } finally {
        setIsLoading(false);
      }
    },
    [defaultNFT, defaultTokenId, readContract]
  );

  /**
   * Automatically fetch NFT metadata when default NFT or token ID changes.
   */
  useEffect(() => {
    if (defaultNFT && defaultTokenId !== undefined) {
      getNFTMetadata();
    }
  }, [defaultNFT, defaultTokenId, getNFTMetadata]);

  return {
    isLoading,
    error,
    nftMetadata,
    getNFTMetadata
  };
}
