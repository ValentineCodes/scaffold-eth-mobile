import { Abi, AbiFunction } from 'abitype';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import {
  Contract,
  ContractName,
  GenericContract,
  InheritedFunctions
} from '../../../../../../../utils/scaffold-eth/contract';
import WriteOnlyFunctionForm from './WriteOnlyFunctionForm';

export default function ContractWriteMethods({
  onChange,
  deployedContractData
}: {
  onChange: () => void;
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
      const isWriteableFunction =
        fn.stateMutability !== 'view' && fn.stateMutability !== 'pure';
      return isWriteableFunction;
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
        No write methods
      </Text>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      {functionsToDisplay.map(({ fn }, idx) => (
        <WriteOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          key={`${fn.name}-${idx}}`}
          abiFunction={fn}
          contractAddress={deployedContractData.address}
          onChange={onChange}
        />
      ))}
    </View>
  );
}
