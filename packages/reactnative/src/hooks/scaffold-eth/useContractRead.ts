import { Contract, InterfaceAbi, JsonRpcProvider, Wallet } from 'ethers';
import { useEffect, useState } from 'react';
import { useSecureStorage } from '../useSecureStorage';
import useAccount from './useAccount';
import useNetwork from './useNetwork';

interface UseContractReadConfig {
  abi?: InterfaceAbi;
  address?: string;
  functionName?: string;
  args?: any[];
  enabled?: boolean;
  onError?: (error: any) => void;
}

interface ReadContractConfig {
  abi: InterfaceAbi;
  address: string;
  functionName: string;
  args?: any[];
}

export default function useContractRead({
  abi,
  address,
  functionName,
  args,
  enabled = true,
  onError
}: Partial<UseContractReadConfig> = {}) {
  const network = useNetwork();
  const connectedAccount = useAccount();
  const { getItem } = useSecureStorage();

  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<any>(null);

  async function fetchData() {
    if (!abi || !address || !functionName) {
      console.warn(
        'Missing required parameters: abi, address, or functionName'
      );
      return;
    }

    try {
      setIsLoading(true);
      const provider = new JsonRpcProvider(network.provider);

      const accounts = await getItem('accounts');

      const activeAccount = Array.from(accounts).find(
        account =>
          account.address.toLowerCase() ===
          connectedAccount.address.toLowerCase()
      );

      const wallet = new Wallet(activeAccount.privateKey, provider);

      const contract = new Contract(address, abi, wallet);

      const result = await contract[functionName](...(args || []));

      if (error) {
        setError(null);
      }
      setData(result);

      return result;
    } catch (error) {
      setError(error);

      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function readContract({
    abi,
    address,
    functionName,
    args
  }: ReadContractConfig) {
    try {
      setIsLoading(true);
      const provider = new JsonRpcProvider(network.provider);

      const accounts = await getItem('accounts');

      const activeAccount = Array.from(accounts).find(
        account =>
          account.address.toLowerCase() ===
          connectedAccount.address.toLowerCase()
      );

      const wallet = new Wallet(activeAccount.privateKey, provider);

      const contract = new Contract(address, abi, wallet);

      const result = await contract[functionName](...(args || []));

      return result;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    readContract
  };
}
