import { useCallback } from "react";
import { hexToString, isHex, stringToHex } from "viem";
import InputBase from "./InputBase";
import { CommonInputProps } from "./utils";
import { TouchableRipple, Text } from "react-native-paper";

export default function Bytes32Input({
  value,
  onChange,
  name,
  placeholder,
  disabled,
}: CommonInputProps) {
  const convertStringToBytes32 = useCallback(() => {
    if (!value) {
      return;
    }
    onChange(
      isHex(value)
        ? hexToString(value, { size: 32 })
        : stringToHex(value, { size: 32 }),
    );
  }, [onChange, value]);

  return (
    <InputBase
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      suffix={
        <TouchableRipple onPress={convertStringToBytes32} style={{ paddingHorizontal: 16 }}>
          <Text variant="titleMedium" style={{ fontWeight: "600" }}>
            #
          </Text>
        </TouchableRipple>
      }
    />
  );
}
