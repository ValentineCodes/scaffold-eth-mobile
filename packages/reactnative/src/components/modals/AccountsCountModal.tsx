import { HStack, VStack, Text, Input, Button as RNButton } from 'native-base'
import React, { useState } from 'react'
import Modal from 'react-native-modal';
import { FONT_SIZE } from '../../utils/styles';
import { COLORS } from '../../utils/constants';
import Button from '../Button';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onFinish: (accountsCount: number) => void;
}

const MAX_INITIAL_ACCOUNT = 10

export default function AccountsCountModal({ isVisible, onClose, onFinish }: Props) {
    const [accountsCount, setAccountsCount] = useState("1")
    const [error, setError] = useState("")

    const isAccountsCountValid = (value?: string): boolean => {
        const _accountsCount = Number(value || accountsCount)

        if (isNaN(_accountsCount)) {
            setError("Invalid count")
            return false
        } else if (_accountsCount > MAX_INITIAL_ACCOUNT || _accountsCount < 1) {
            setError(`Initial accounts must be from 1 - ${MAX_INITIAL_ACCOUNT}`)
            return false
        }

        return true
    }

    const handleInputChange = (value: string) => {
        setAccountsCount(value)

        if (error) {
            setError("")
        }

        isAccountsCountValid(value)
    }

    const handleOnFinish = () => {
        if (isAccountsCountValid()) {
            onFinish(Math.floor(Number(accountsCount)))
        }
    }

    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" p="5" alignItems="center" space="4" w="full">
                <Text fontSize={1.1 * FONT_SIZE['xl']} fontWeight="medium" textAlign="center">How many accounts would you like to start with?</Text>

                <Text fontSize={FONT_SIZE['lg']} color={COLORS.primary} textAlign="center">Max: 10</Text>
                <Input
                    value={accountsCount}
                    borderWidth="0"
                    fontSize="4xl"
                    focusOutlineColor={COLORS.primary}
                    onChangeText={handleInputChange}
                    onSubmitEditing={handleOnFinish}
                    keyboardType="number-pad"
                    focusOutlineColor={COLORS.primary}
                    color={COLORS.primary}
                    bgColor="transaparent"
                    selectTextOnFocus
                    _input={{
                        selectionColor: COLORS.primaryLight,
                        cursorColor: COLORS.primary,
                    }}
                    textAlign="center"
                />
                {error && <Text fontSize="sm" color="red.400">{error}</Text>}

                <HStack w="full" alignItems="center" justifyContent="space-between">
                    <RNButton py="4" bgColor="red.100" w="50%" onPress={onClose} _pressed={{ backgroundColor: 'red.200' }}><Text color="red.400" bold fontSize="md">Cancel</Text></RNButton>
                    <Button text="Continue" onPress={handleOnFinish} style={{ width: "50%", borderRadius: 0 }} />
                </HStack>
            </VStack>
        </Modal >
    )
}