import { useCallback, useEffect, useState } from 'react';
import { Address, erc20Abi } from 'viem';
import useContractRead from './scaffold-eth/useContractRead';

/**
 * Options for the `useTokenMetadata` hook.
 */
interface UseTokenMetadataOptions {
  token?: Address;
}

/**
 * ERC20 token metadata.
 */
export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
}

/**
 * Result of the `useTokenMetadata` hook.
 */
interface UseTokenMetadataResult {
  isLoading: boolean;
  error: Error | null;
  tokenMetadata: TokenMetadata | null;
  getTokenMetadata: (token?: Address) => Promise<TokenMetadata | undefined>;
}

/**
 * Hook to retrieve metadata of a specified ERC20 token.
 *
 * @param {UseTokenMetadataOptions} [options] - Options including an optional ERC20 token contract address.
 * @returns {UseTokenMetadataResult} - Loading state, error, token metadata, and the `getTokenMetadata` function.
 */
export function useTokenMetadata({
  token: defaultToken
}: UseTokenMetadataOptions = {}): UseTokenMetadataResult {
  const { readContract } = useContractRead();

  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch and set metadata (name, symbol, decimals) for the given ERC20 token.
   */
  const getTokenMetadata = useCallback(
    async (token: Address = defaultToken!) => {
      if (!token) {
        setError(new Error('Token address is required'));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [name, symbol, decimals] = (await Promise.all([
          readContract({
            address: token,
            abi: erc20Abi,
            functionName: 'name'
          }),
          readContract({
            address: token,
            abi: erc20Abi,
            functionName: 'symbol'
          }),
          readContract({
            address: token,
            abi: erc20Abi,
            functionName: 'decimals'
          })
        ])) as [string, string, number];

        const metadata: TokenMetadata = {
          name,
          symbol,
          decimals
        };
        setTokenMetadata(metadata);
        return metadata;
      } catch (err) {
        setError(err as Error);
        setTokenMetadata(null);
      } finally {
        setIsLoading(false);
      }
    },
    [defaultToken]
  );

  /**
   * Automatically fetch token metadata when default token changes.
   */
  useEffect(() => {
    if (defaultToken) {
      getTokenMetadata();
    }
  }, [defaultToken, getTokenMetadata]);

  return {
    isLoading,
    error,
    tokenMetadata,
    getTokenMetadata
  };
}
