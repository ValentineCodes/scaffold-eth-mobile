import { useEffect, useState } from 'react';
import { useIsMounted } from 'usehooks-ts';
import { useNetwork } from '.';
import { ContractCodeStatus, contracts } from '../../utils/scaffold-eth';

/**
 * Gets the matching contract info for the provided contract name from the contracts present in deployedContracts.ts
 * and externalContracts.ts corresponding to networks configured in scaffold.config.ts
 */
export const useDeployedContractInfo = (contractName: string) => {
  const isMounted = useIsMounted();
  const network = useNetwork();
  const deployedContract = contracts?.[network.id]?.[contractName];
  const [status, setStatus] = useState<ContractCodeStatus>(
    ContractCodeStatus.LOADING
  );

  useEffect(() => {
    const checkContractDeployment = async () => {
      if (!deployedContract) {
        setStatus(ContractCodeStatus.NOT_FOUND);
        return;
      }

      if (!isMounted()) {
        return;
      }

      setStatus(ContractCodeStatus.DEPLOYED);
    };

    checkContractDeployment();
  }, [isMounted, contractName, deployedContract]);

  return {
    data: status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
    isLoading: status === ContractCodeStatus.LOADING
  };
};
