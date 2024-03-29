import { Text, VStack, HStack, Input, Icon, Pressable } from 'native-base'
import React, { useState } from 'react'
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import { TouchableOpacity } from 'react-native';

type Props = {
    value?: string;
    infoText?: string | null;
    errorText?: string | null;
    onChange: (value: string) => void;
    onBlur?: () => void;
}

export default function SeedPhraseInput({ value, infoText, errorText, onChange, onBlur }: Props) {
    const [show, setShow] = useState(false)
    return (
        <VStack space={2}>
            <Text fontSize={FONT_SIZE["xl"]} bold>Seed Phrase</Text>
            <Input
                borderRadius="lg"
                variant="filled"
                pt="4"
                pl="4"
                pr="20"
                pb="12"
                fontSize="md"
                focusOutlineColor={COLORS.primary}
                value={value}
                InputRightElement={
                    <HStack space={1} position="absolute" right="2" top="5">
                        {value && (
                            <TouchableOpacity activeOpacity={0.4} onPress={() => onChange("")} >
                                <Icon as={<MaterialIcons name="close" />} size={5} mr="2" color="muted.400" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity activeOpacity={0.4} onPress={() => setShow(!show)} >
                            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                        </TouchableOpacity>
                    </HStack>

                }
                secureTextEntry={!show}
                multiline={show}
                placeholder='Seed Phrase'
                onChangeText={onChange}
                onBlur={onBlur}
                _input={{
                    selectionColor: COLORS.primary,
                    cursorColor: '#303030',
                }}
            />
            {infoText ? <Text fontSize="sm" color="muted.400">{infoText}</Text> : null}
            {errorText ? <Text fontSize="sm" color="red.400">{errorText}</Text> : null}
        </VStack>
    )
}