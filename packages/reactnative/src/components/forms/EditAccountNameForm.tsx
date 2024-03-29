import React, { useState } from 'react'
import { HStack, VStack, Input, Icon, Text } from "native-base"
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { useSelector, useDispatch } from 'react-redux'
import { Account, changeName } from '../../store/reducers/Accounts'
import { COLORS } from '../../utils/constants'

type Props = {
    close: () => void
}

export default function EditAccountNameForm({ close }: Props) {
    const dispatch = useDispatch()

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [name, setName] = useState(connectedAccount.name)
    const [error, setError] = useState("")

    const editName = () => {
        if (name.trim().length === 0) {
            setError("Account name cannot be empty")
            return
        }
        if (accounts.find(account => account.name == name) !== undefined) {
            setError("Account name already exists")
            return
        }
        dispatch(changeName({ address: connectedAccount.address, newName: name }))
        close()
    }

    const handleInputChange = (value: string) => {
        setName(value)
        if (error) {
            setError("")
        }
    }
    return (
        <VStack w="full" alignItems="center">
            <HStack alignItems="center" space={2}>
                <Icon as={<Ionicons name="close-outline" />} size={7} color="red.400" onPress={close} />

                <Input
                    placeholder='New account name'
                    value={name}
                    onChangeText={handleInputChange}
                    onSubmitEditing={editName}
                    borderRadius="lg"
                    variant="filled"
                    fontSize="md"
                    w="60%"
                    focusOutlineColor={COLORS.primary}
                    selectTextOnFocus
                    _input={{
                        selectionColor: COLORS.primary,
                        cursorColor: COLORS.primary,
                    }}
                />

                <Icon as={<Ionicons name="checkmark-done-outline" />} size={5} color={COLORS.primary} onPress={editName} />
            </HStack>

            {error && <Text fontSize="sm" color="red.400">{error}</Text>}
        </VStack>
    )
}