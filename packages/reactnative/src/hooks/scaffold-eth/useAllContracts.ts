import { useNetwork } from '.';
import { contracts, GenericContract } from '../../utils/scaffold-eth/contract';

export function useAllContracts(): {
  [contractName: string]: GenericContract;
} {
  const network = useNetwork();

  const contractsData = contracts?.[network.id];
  return contractsData ? contractsData : {};
}
