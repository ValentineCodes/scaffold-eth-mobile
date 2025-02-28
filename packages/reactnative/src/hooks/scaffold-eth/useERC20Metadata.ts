import { useCallback, useEffect, useState } from 'react';
import { Address, erc20Abi } from 'viem';
import { useContractRead } from '.';

/**
 * Options for the `useERC20Metadata` hook.
 */
interface UseERC20MetadataOptions {
  token?: Address;
}

/**
 * ERC20 token metadata.
 */
export interface ERC20Metadata {
  name: string;
  symbol: string;
  decimals: number;
}

/**
 * Result of the `useERC20Metadata` hook.
 */
interface UseERC20MetadataResult {
  isLoading: boolean;
  error: Error | null;
  data: ERC20Metadata | null;
  getERC20Metadata: (token?: Address) => Promise<ERC20Metadata | undefined>;
}

/**
 * Hook to retrieve metadata of a specified ERC20 token.
 *
 * @param {UseERC20MetadataOptions} [options] - Options including an optional ERC20 token contract address.
 * @returns {UseERC20MetadataResult} - Loading state, error, token metadata, and the `getERC20Metadata` function.
 */
export function useERC20Metadata({
  token: defaultToken
}: UseERC20MetadataOptions = {}): UseERC20MetadataResult {
  const { readContract } = useContractRead();

  const [data, setData] = useState<ERC20Metadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch and set metadata (name, symbol, decimals) for the given ERC20 token.
   */
  const getERC20Metadata = useCallback(
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

        const metadata: ERC20Metadata = {
          name,
          symbol,
          decimals
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
    [defaultToken]
  );

  /**
   * Automatically fetch token metadata when default token changes.
   */
  useEffect(() => {
    if (defaultToken) {
      getERC20Metadata();
    }
  }, [defaultToken, getERC20Metadata]);

  return {
    isLoading,
    error,
    data,
    getERC20Metadata
  };
}
