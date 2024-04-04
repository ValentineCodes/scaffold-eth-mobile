import { useCallback, useEffect, useState } from "react";
import { blo } from "blo";
import { useDebounceValue } from "usehooks-ts";
import { Address, isAddress } from "viem";
import { useEnsAddress, useEnsAvatar, useEnsName } from "wagmi";
import InputBase from "./InputBase";
import { CommonInputProps, isENS } from "./utils";
import { HStack, Image, Text, View } from "native-base";

/**
 * Address input with ENS name resolution
 */
export default function AddressInput({ value, name, placeholder, onChange, disabled }: CommonInputProps<Address | string>) {
    // Debounce the input to keep clean RPC calls when resolving ENS names
    // If the input is an address, we don't need to debounce it
    const [_debouncedValue, setDebouncedValue] = useDebounceValue(value, 500);
    const debouncedValue = isAddress(value) ? value : _debouncedValue;
    const isDebouncedValueLive = debouncedValue === value;

    // If the user changes the input after an ENS name is already resolved, we want to remove the stale result
    const settledValue = isDebouncedValueLive ? debouncedValue : undefined;

    const { data: ensAddress, isLoading: isEnsAddressLoading } = useEnsAddress({
        name: settledValue,
        enabled: isENS(debouncedValue),
        chainId: 1,
        cacheTime: 30_000,
    });

    const [enteredEnsName, setEnteredEnsName] = useState<string>();
    const { data: ensName, isLoading: isEnsNameLoading } = useEnsName({
        address: settledValue as Address,
        enabled: isAddress(debouncedValue),
        chainId: 1,
        cacheTime: 30_000,
    });

    const { data: ensAvatar } = useEnsAvatar({
        name: ensName,
        enabled: Boolean(ensName),
        chainId: 1,
        cacheTime: 30_000,
    });

    // ens => address
    useEffect(() => {
        if (!ensAddress) return;

        // ENS resolved successfully
        setEnteredEnsName(debouncedValue);
        onChange(ensAddress);
    }, [ensAddress, onChange, debouncedValue]);

    const handleChange = useCallback(
        (newValue: Address) => {
            setEnteredEnsName(undefined);
            onChange(newValue);
        },
        [onChange],
    );

    return (
        <InputBase<Address>
            name={name}
            placeholder={placeholder}
            error={ensAddress === null}
            value={value as Address}
            onChange={handleChange}
            disabled={isEnsAddressLoading || isEnsNameLoading || disabled}
            prefix={
                ensName && (
                    <HStack roundedLeft={"full"} alignItems={"center"}>
                        {ensAvatar ? (
                            <View w={35}>
                                {
                                    <Image w={"full"} rounded={"full"} src={ensAvatar} alt={`${ensAddress} avatar`} />
                                }
                            </View>
                        ) : null}
                        <Text fontSize={"md"} px={"2"}>{enteredEnsName ?? ensName}</Text>
                    </HStack>
                )
            }
            suffix={
                value && <Image alt="" rounded={"full"} src={blo(value as `0x${string}`)} width="35" height="35" />
            }
        />
    );
};
