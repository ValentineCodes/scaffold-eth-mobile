import {
  Abi
} from "abitype";
import {
  Address
} from "viem";

import deployedContractsData from "../../contracts/deployedContracts";
import scaffoldConfig from "../../scaffold.config";

export enum ContractCodeStatus {
  "LOADING",
  "DEPLOYED",
  "NOT_FOUND",
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

type ConfiguredChainId = (typeof scaffoldConfig)["targetNetworks"][0]["id"];

type IsContractDeclarationMissing<TYes, TNo> = typeof contractsData extends { [key in ConfiguredChainId]: any }
  ? TNo
  : TYes;

type ContractsDeclaration = IsContractDeclarationMissing<GenericContractsDeclaration, typeof contractsData>;

type Contracts = ContractsDeclaration[ConfiguredChainId];

const deepMergeContracts = (
  local
) => {
  const result = {};
  const allKeys = Array.from(new Set(Object.keys(local)));
  for (const key of allKeys) {
      result[key] = local[key];
  }

  return result;
};

const contractsData = deepMergeContracts(deployedContractsData);

export const contracts = contractsData as GenericContractsDeclaration | null;

export type ContractName = keyof Contracts;

export type Contract<TContractName extends ContractName> = Contracts[TContractName];