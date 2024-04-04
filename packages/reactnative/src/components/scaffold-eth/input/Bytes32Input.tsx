import { useCallback } from "react";
import { hexToString, isHex, stringToHex } from "viem";
import InputBase from "./InputBase";
import { CommonInputProps } from "./utils";
import { Pressable, Text } from "native-base";

export default function Bytes32Input({ value, onChange, name, placeholder, disabled }: CommonInputProps) {
    const convertStringToBytes32 = useCallback(() => {
        if (!value) {
            return;
        }
        onChange(isHex(value) ? hexToString(value, { size: 32 }) : stringToHex(value, { size: 32 }));
    }, [onChange, value]);

    return (
        <InputBase
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            suffix={
                <Pressable onPress={convertStringToBytes32} px={"4"}>
                    <Text fontSize={"md"} fontWeight={"semibold"}>#</Text>
                </Pressable>
            }
        />
    );
};
