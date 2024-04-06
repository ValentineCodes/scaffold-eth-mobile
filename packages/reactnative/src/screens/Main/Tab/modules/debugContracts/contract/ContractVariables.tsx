import { Abi, AbiFunction } from "abitype";
import { Contract } from "ethers";
import { ContractName, GenericContract, InheritedFunctions } from "../../../../../../../utils/scaffold-eth/contract";
import { Text } from "native-base";
import DisplayVariable from "./DisplayVariable";

export default function ContractVariables({
    refreshDisplayVariables,
    deployedContractData,
}: {
    refreshDisplayVariables: boolean;
    deployedContractData: Contract<ContractName>;
}) {
    if (!deployedContractData) {
        return null;
    }

    const functionsToDisplay = (
        (deployedContractData.abi as Abi).filter(part => part.type === "function") as AbiFunction[]
    )
        .filter(fn => {
            const isQueryableWithNoParams =
                (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;
            return isQueryableWithNoParams;
        })
        .map(fn => {
            return {
                fn,
                inheritedFrom: ((deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions)?.[fn.name],
            };
        })
        .sort((a, b) => (b.inheritedFrom ? b.inheritedFrom.localeCompare(a.inheritedFrom) : 1));

    if (!functionsToDisplay.length) {
        return <Text fontSize={"xl"} fontWeight={"light"}>No contract variables</Text>;
    }

    return (
        <>
            {functionsToDisplay.map(({ fn, inheritedFrom }) => (
                <DisplayVariable
                    abi={deployedContractData.abi as Abi}
                    abiFunction={fn}
                    contractAddress={deployedContractData.address}
                    key={fn.name}
                    refreshDisplayVariables={refreshDisplayVariables}
                />
            ))}
        </>
    );
};
