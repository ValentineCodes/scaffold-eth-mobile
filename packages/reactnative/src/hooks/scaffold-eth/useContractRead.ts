import { useEffect, useState } from "react";
import useNetwork from "./useNetwork";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import useAccount from "./useAccount";
import { useSecureStorage } from "../useSecureStorage";
import { Abi } from "abitype";

interface UseContractReadConfig {
  abi: Abi;
  address: string;
  functionName: string;
  args?: any[];
  enabled?: boolean;
  onError?: (error: any) => void;
}

export default function useContractRead({
  abi,
  address,
  functionName,
  args,
  enabled,
  onError,
}: UseContractReadConfig) {
  const network = useNetwork();
  const connectedAccount = useAccount();
  const { getItem } = useSecureStorage();

  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(enabled || false);
  const [error, setError] = useState<any>(null);

  async function fetchData() {
    try {
      setIsLoading(true);
      const provider = new JsonRpcProvider(network.provider);

      const accounts = await getItem("accounts");

      const activeAccount = Array.from(accounts).find(
        (account) =>
          account.address.toLowerCase() ===
          connectedAccount.address.toLowerCase(),
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

  useEffect(() => {
    if (enabled !== false) {
      fetchData();
    }
  }, [enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
