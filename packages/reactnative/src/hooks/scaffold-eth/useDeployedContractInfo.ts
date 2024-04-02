import { useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { ContractCodeStatus, contracts } from "../../../utils/scaffold-eth/contract";
import scaffoldConfig from "../../../scaffold.config";

/**
 * Gets the matching contract info for the provided contract name from the contracts present in deployedContracts.ts
 * and externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 */
export const useDeployedContractInfo = (contractName) => {
  const isMounted = useIsMounted();
  const { targetNetworks } = scaffoldConfig;
  const deployedContract = contracts?.[targetNetworks[0].id]?.[contractName];
  const [status, setStatus] = useState<ContractCodeStatus>(ContractCodeStatus.LOADING);

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
    isLoading: status === ContractCodeStatus.LOADING,
  };
};
