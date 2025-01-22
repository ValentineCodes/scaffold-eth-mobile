import { useCallback } from "react";
import { bytesToString, isHex, toBytes, toHex } from "viem";
import InputBase from "./InputBase";
import { CommonInputProps } from "./utils";
import { TouchableRipple, Text } from "react-native-paper";

type Props = {};

export default function BytesInput({
  value,
  onChange,
  name,
  placeholder,
  disabled,
}: CommonInputProps) {
  const convertStringToBytes = useCallback(() => {
    onChange(
      isHex(value) ? bytesToString(toBytes(value)) : toHex(toBytes(value)),
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
        <TouchableRipple onPress={convertStringToBytes} style={{ paddingHorizontal: 16 }}>
          <Text variant="bodyLarge" style={{ fontWeight: '600' }}>
            #
          </Text>
        </TouchableRipple>
      }
    />
  );
}
