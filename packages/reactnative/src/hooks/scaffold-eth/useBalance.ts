import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import useNetwork from './useNetwork';

interface UseBalanceConfig {
  address: string;
}

/**
 *
 * @param config - The config settings
 * @param config.address - account address
 */
export default function useBalance({ address }: UseBalanceConfig) {
  const network = useNetwork();

  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<any>(null);

  async function getBalance() {
    setIsLoading(true);

    try {
      const provider = new ethers.JsonRpcProvider(network.provider);
      const balance = await provider.getBalance(address);

      setBalance(balance);

      if (error) {
        setError(null);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function refetch() {
    setIsRefetching(true);
    await getBalance();
    setIsRefetching(false);
  }

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(network.provider);

    provider.off('block');

    getBalance();

    provider.on('block', blockNumber => {
      getBalance();
    });

    return () => {
      provider.off('block');
    };
  }, [address, network]);

  return {
    balance,
    refetch,
    isLoading,
    isRefetching,
    error
  };
}
