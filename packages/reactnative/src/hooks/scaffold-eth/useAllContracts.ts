import { useNetwork } from '.';
import { contracts, GenericContract } from '../../utils/scaffold-eth';

export function useAllContracts(): {
  [contractName: string]: GenericContract;
} {
  const network = useNetwork();

  const contractsData = contracts?.[network.id];
  return contractsData ? contractsData : {};
}
