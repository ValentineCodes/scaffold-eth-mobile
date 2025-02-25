import { Abi } from 'abitype';
import { Address } from 'viem';
import deployedContractsData from '../../../contracts/deployedContracts';
import externalContractsData from '../../../contracts/externalContracts';

export enum ContractCodeStatus {
  'LOADING',
  'DEPLOYED',
  'NOT_FOUND'
}

export type InheritedFunctions = { readonly [key: string]: string };

export type GenericContract = {
  address: Address;
  abi: Abi;
  inheritedFunctions?: InheritedFunctions;
  external?: true;
};

export type GenericContractsDeclaration = {
  [chainId: number]: {
    [contractName: string]: GenericContract;
  };
};

type ConfiguredChainId = number;

type IsContractDeclarationMissing<TYes, TNo> = typeof contractsData extends {
  [key in ConfiguredChainId]: any;
}
  ? TNo
  : TYes;

type ContractsDeclaration = IsContractDeclarationMissing<
  GenericContractsDeclaration,
  typeof contractsData
>;

type Contracts = ContractsDeclaration[ConfiguredChainId];

const deepMergeContracts = (local, external) => {
  const result = {};
  const allKeys = Array.from(
    new Set([...Object.keys(external), ...Object.keys(local)])
  );
  for (const key of allKeys) {
    if (!external[key]) {
      result[key] = local[key];
      continue;
    }
    const amendedExternal = Object.fromEntries(
      Object.entries(external[key]).map(([contractName, declaration]) => [
        contractName,
        { ...declaration, external: true }
      ])
    );
    result[key] = { ...local[key], ...amendedExternal };
  }
  return result;
};

const contractsData = deepMergeContracts(
  deployedContractsData,
  externalContractsData
);

export const contracts = contractsData as GenericContractsDeclaration | null;

export type ContractName = keyof Contracts;

export type Contract<TContractName extends ContractName> =
  Contracts[TContractName];
