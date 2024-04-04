import { useCallback } from "react";
import { bytesToString, isHex, toBytes, toHex } from "viem";
import InputBase from "./InputBase";
import { CommonInputProps } from "./utils";
import { Pressable, Text } from "native-base";

type Props = {}

export default function BytesInput({ value, onChange, name, placeholder, disabled }: CommonInputProps) {
    const convertStringToBytes = useCallback(() => {
        onChange(isHex(value) ? bytesToString(toBytes(value)) : toHex(toBytes(value)));
    }, [onChange, value]);

    return (
        <InputBase
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            suffix={
                <Pressable onPress={convertStringToBytes} px={"4"}>
                    <Text fontSize={"md"} fontWeight={"semibold"}>#</Text>
                </Pressable>
            }
        />
    );
}