import { Text } from 'native-base'
import React from 'react'
import { GenericContract, InheritedFunctions } from '../../../../../../../utils/scaffold-eth/contract';
import { Abi, AbiFunction } from "abitype";
import ReadOnlyFunctionForm from './ReadOnlyFunctionForm';

type Props = {
    deployedContractData: any
}

export default function ContractReadMethods({ deployedContractData }: Props) {
    if (!deployedContractData) {
        return null;
    }

    const functionsToDisplay = (
        ((deployedContractData.abi || []) as Abi).filter(part => part.type === "function") as AbiFunction[]
    )
        .filter(fn => {
            const isQueryableWithParams =
                (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length > 0;
            return isQueryableWithParams;
        })
        .map(fn => {
            return {
                fn,
                inheritedFrom: ((deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions)?.[fn.name],
            };
        })
        .sort((a, b) => (b.inheritedFrom ? b.inheritedFrom.localeCompare(a.inheritedFrom) : 1));

    if (!functionsToDisplay.length) {
        return <Text fontSize={"xl"} fontWeight={"light"}>No read methods</Text>;
    }
    return (
        <>
            {functionsToDisplay.map(({ fn, inheritedFrom }) => (
                <ReadOnlyFunctionForm
                    key={fn.name}
                    abi={deployedContractData.abi as Abi}
                    contractAddress={deployedContractData.address}
                    abiFunction={fn}
                />
            ))}
        </>
    )
}