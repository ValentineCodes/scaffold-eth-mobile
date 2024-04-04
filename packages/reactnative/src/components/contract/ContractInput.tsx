import { AbiParameter } from 'abitype';
import React, { Dispatch, SetStateAction } from 'react'
import InputBase from '../scaffold-eth/input/InputBase';
import Bytes32Input from '../scaffold-eth/input/Bytes32Input';
import BytesInput from '../scaffold-eth/input/BytesInput';
import IntegerInput from '../scaffold-eth/input/IntegerInput';
import { IntegerVariant } from '../scaffold-eth/input/utils';

type Props = {
    setForm: Dispatch<SetStateAction<Record<string, any>>>;
    form: Record<string, any> | undefined;
    stateObjectKey: string;
    paramType: AbiParameter;
}

export default function ContractInput({ setForm, form, stateObjectKey, paramType }: Props) {
    const inputProps = {
        name: stateObjectKey,
        value: form?.[stateObjectKey],
        placeholder: paramType.name ? `${paramType.type} ${paramType.name}` : paramType.type,
        onChange: (value: any) => {
            setForm(form => ({ ...form, [stateObjectKey]: value }));
        },
    };

    if (paramType.type === "bytes32") {
        return <Bytes32Input {...inputProps} />;
    } else if (paramType.type === "bytes") {
        return <BytesInput {...inputProps} />;
    } else if (paramType.type === "string") {
        return <InputBase {...inputProps} />;
    } else if (paramType.type.includes("int") && !paramType.type.includes("[")) {
        return <IntegerInput {...inputProps} variant={paramType.type as IntegerVariant} />;
    }

    return <InputBase {...inputProps} />
}