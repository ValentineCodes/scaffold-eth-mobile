import { useCallback, useEffect, useState } from 'react';
import { Address, erc721Abi } from 'viem';
import { useContractRead } from '.';

/**
 * Options for the `useERC721Metadata` hook.
 */
interface UseERC721MetadataOptions {
  nft?: Address;
  tokenId?: string | number;
}

/**
 * NFT metadata.
 */
export interface ERC721Metadata {
  name: string;
  symbol: string;
  tokenURI: string;
}

/**
 * Result of the `useERC721Metadata` hook.
 */
interface UseERC721MetadataResult {
  isLoading: boolean;
  error: Error | null;
  data: ERC721Metadata | null;
  getERC721Metadata: (
    nft?: Address,
    tokenId?: string | number
  ) => Promise<ERC721Metadata | undefined>;
}

/**
 * Hook to retrieve metadata of a specified NFT (ERC721).
 *
 * @param {UseERC721MetadataOptions} [options] - Options including an optional NFT contract address and token ID.
 * @returns {UseERC721MetadataResult} - Loading state, error, NFT metadata, and the `getERC721Metadata` function.
 */
export function useERC721Metadata({
  nft: defaultNFT,
  tokenId: defaultTokenId
}: UseERC721MetadataOptions = {}): UseERC721MetadataResult {
  const { readContract } = useContractRead();

  const [data, setData] = useState<ERC721Metadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch and set metadata (name, symbol, tokenURI) for the given NFT.
   */
  const getERC721Metadata = useCallback(
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

        const metadata: ERC721Metadata = {
          name,
          symbol,
          tokenURI
        };
        setData(metadata);
        return metadata;
      } catch (err) {
        setError(err as Error);
        setData(null);
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
      getERC721Metadata();
    }
  }, [defaultNFT, defaultTokenId, getERC721Metadata]);

  return {
    isLoading,
    error,
    data,
    getERC721Metadata
  };
}
