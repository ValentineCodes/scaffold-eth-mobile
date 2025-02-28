import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { Address, erc20Abi } from 'viem';
import { useAccount, useContractRead, useNetwork } from '.';

/**
 * Hook to retrieve the balance of a specified ERC20 token for a user.
 *
 * @param {Object} options - Optional parameters.
 * @param {Address} options.token - The ERC20 token contract address.
 * @param {Address} options.userAddress - The address of the user to fetch the token balance for.
 * @returns {Object} - An object containing loading state, error, balance, and the `getERC20Balance` function.
 */
interface UseERC20BalanceOptions {
  token?: Address;
  userAddress?: Address;
}

interface UseERC20BalanceResult {
  isLoading: boolean;
  error: Error | null;
  balance: bigint | null;
  getERC20Balance: (
    token?: Address,
    userAddress?: Address
  ) => Promise<bigint | undefined>;
}

export function useERC20Balance({
  token: defaultToken,
  userAddress: defaultUserAddress
}: UseERC20BalanceOptions = {}): UseERC20BalanceResult {
  const { address: connectedAddress } = useAccount();
  const network = useNetwork();
  const { readContract } = useContractRead();

  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch the token balance for a specified user and token.
   *
   * @param {Address} token - The token address. Defaults to the provided `defaultToken`.
   * @param {Address} userAddress - The user's address. Defaults to the provided `userAddress` or the connected address.
   * @returns {Promise<bigint>} - The token balance of the user.
   */
  const getERC20Balance = useCallback(
    async (
      token: Address = defaultToken!,
      userAddress: Address = defaultUserAddress ||
        (connectedAddress as `0x${string}`)
    ) => {
      try {
        if (!token) throw new Error('Token address is required');
        if (!userAddress) throw new Error('User address is required');

        setIsLoading(true);
        setError(null);

        const balance = await readContract({
          address: token,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [userAddress]
        });

        if (balance === undefined) {
          throw new Error('Failed to retrieve balance');
        }

        const balanceBigInt = balance as bigint;
        setBalance(balanceBigInt);
        return balanceBigInt;
      } catch (err) {
        const error = err as Error;
        setError(error);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    },
    [defaultToken, defaultUserAddress, connectedAddress]
  );

  // Automatically fetch the balance when the token or userAddress changes
  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(network.provider);

    provider.off('block');

    if (defaultToken) {
      getERC20Balance();
    }

    provider.on('block', blockNumber => {
      if (defaultToken) {
        getERC20Balance();
      }
    });

    return () => {
      provider.off('block');
    };
  }, [defaultToken, defaultUserAddress, connectedAddress, getERC20Balance]);

  return {
    isLoading,
    error,
    balance,
    getERC20Balance
  };
}
