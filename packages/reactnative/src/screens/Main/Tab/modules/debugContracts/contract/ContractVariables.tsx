import { Abi, AbiFunction } from 'abitype';
import { InterfaceAbi } from 'ethers';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import {
  Contract,
  ContractName,
  GenericContract,
  InheritedFunctions
} from '../../../../../../utils/scaffold-eth';
import DisplayVariable from './DisplayVariable';

export default function ContractVariables({
  refreshDisplayVariables,
  deployedContractData
}: {
  refreshDisplayVariables: boolean;
  deployedContractData: Contract<ContractName>;
}) {
  if (!deployedContractData) {
    return null;
  }

  const functionsToDisplay = (
    (deployedContractData.abi as Abi).filter(
      part => part.type === 'function'
    ) as AbiFunction[]
  )
    .filter(fn => {
      const isQueryableWithNoParams =
        (fn.stateMutability === 'view' || fn.stateMutability === 'pure') &&
        fn.inputs.length === 0;
      return isQueryableWithNoParams;
    })
    .map(fn => {
      return {
        fn,
        inheritedFrom: (
          (deployedContractData as GenericContract)
            ?.inheritedFunctions as InheritedFunctions
        )?.[fn.name]
      };
    })
    .sort((a, b) =>
      b.inheritedFrom ? b.inheritedFrom.localeCompare(a.inheritedFrom) : 1
    );

  if (!functionsToDisplay.length) {
    return (
      <Text variant="headlineSmall" style={{ fontWeight: '300' }}>
        No contract variables
      </Text>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      {functionsToDisplay.map(({ fn }) => (
        <DisplayVariable
          abi={deployedContractData.abi as InterfaceAbi}
          abiFunction={fn}
          contractAddress={deployedContractData.address}
          key={fn.name}
          refreshDisplayVariables={refreshDisplayVariables}
        />
      ))}
    </View>
  );
}
