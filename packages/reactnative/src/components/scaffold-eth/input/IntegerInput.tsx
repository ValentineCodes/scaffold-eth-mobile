import { useCallback, useEffect, useState } from "react";
import InputBase from "./InputBase";
import { CommonInputProps, IntegerVariant, isValidInteger } from "./utils";
import { Pressable, Text } from "native-base";

type IntegerInputProps = CommonInputProps<string | bigint> & {
    variant?: IntegerVariant;
    disableMultiplyBy1e18?: boolean;
};

export default function IntegerInput({
    value,
    onChange,
    name,
    placeholder,
    disabled,
    variant = IntegerVariant.UINT256,
    disableMultiplyBy1e18 = false,
}: IntegerInputProps) {
    const [inputError, setInputError] = useState(false);
    const multiplyBy1e18 = useCallback(() => {
        if (!value) {
            return;
        }
        if (typeof value === "bigint") {
            return onChange(value * 10n ** 18n);
        }
        return onChange(BigInt(Math.round(Number(value) * 10 ** 18)));
    }, [onChange, value]);

    useEffect(() => {
        if (isValidInteger(variant, value, false)) {
            setInputError(false);
        } else {
            setInputError(true);
        }
    }, [value, variant]);

    return (
        <InputBase
            name={name}
            value={value}
            placeholder={placeholder}
            error={inputError}
            onChange={onChange}
            disabled={disabled}
            suffix={
                !inputError &&
                !disableMultiplyBy1e18 && (
                    <Pressable
                        onPress={multiplyBy1e18}
                        isDisabled={disabled}
                        px={"4"}
                        mt={"1"}
                    >
                        <Text fontSize={"xl"} fontWeight={"semibold"}>*</Text>
                    </Pressable>
                )
            }
        />
    );
};
