import { Text, VStack, Input, Icon, HStack } from 'native-base'
import React, { useState } from 'react'
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import { TouchableOpacity } from 'react-native';

type Props = {
  label: string;
  value?: string;
  suggestion?: string;
  defaultValue?: string;
  infoText?: string | boolean | null;
  errorText?: string | boolean | null;
  onChange: (value: string) => void;
}

function PasswordInput({ label, value, suggestion, defaultValue, infoText, errorText, onChange }: Props) {
  const [show, setShow] = useState(false)

  const useSuggestion = () => {
    onChange(suggestion)
  }

  return (
    <VStack space={2}>
      <Text fontSize={FONT_SIZE["xl"]} bold>{label}</Text>
      <Input
        defaultValue={defaultValue}
        value={value}
        borderRadius="lg"
        variant="filled"
        fontSize="md"
        focusOutlineColor={COLORS.primary}
        InputLeftElement={
          <Icon as={<MaterialIcons name="lock" />} size={5} ml="4" color="muted.400" />
        }
        InputRightElement={
          value || !suggestion ? (
            <HStack space={1}>
              {value && (
                <TouchableOpacity activeOpacity={0.4} onPress={() => onChange("")}>
                  <Icon as={<MaterialIcons name="close" />} size={5} mr="2" color="muted.400" />
                </TouchableOpacity>
              )}
              <TouchableOpacity activeOpacity={0.4} onPress={() => setShow(!show)} mr="2">
                <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
              </TouchableOpacity>
            </HStack>
          ) : (
            <TouchableOpacity activeOpacity={0.4} onPress={useSuggestion}>
              <Text fontSize={FONT_SIZE['lg']} color={COLORS.primary} mr="2">Use Suggestion</Text>
            </TouchableOpacity>
          )
        }
        secureTextEntry={!show}
        placeholder={suggestion ? `Suggestion: ${suggestion}` : "Password"}
        onChangeText={onChange}
      />
      {infoText ? <Text fontSize="sm" color="muted.400">{infoText}</Text> : null}
      {errorText ? <Text fontSize="sm" color="red.400">{errorText}</Text> : null}
    </VStack>
  )
}

export default PasswordInput