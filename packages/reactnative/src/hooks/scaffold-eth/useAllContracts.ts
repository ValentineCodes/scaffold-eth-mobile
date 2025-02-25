import { contracts, GenericContract } from '../../utils/scaffold-eth/contract';
import useNetwork from './useNetwork';

export function useAllContracts(): {
  [contractName: string]: GenericContract;
} {
  const network = useNetwork();

  const contractsData = contracts?.[network.id];
  return contractsData ? contractsData : {};
}
