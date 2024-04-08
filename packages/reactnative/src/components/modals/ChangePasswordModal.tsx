import { VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import { WINDOW_WIDTH } from '../../utils/styles'
import PasswordInput from '../forms/PasswordInput'
import Button from '../Button'
import { generate } from 'random-words'
import { useToast } from 'react-native-toast-notifications'
import SInfo from "react-native-sensitive-info"

type Props = {
    modal: {
        closeModal: () => void
    }
}

export default function ChangePasswordModal({ modal: { closeModal } }: Props) {
    const toast = useToast()

    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: ""
    })
    const [suggestion, setSuggestion] = useState("")

    const change = async () => {
        try {
            const _security = await SInfo.getItem("security", {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            });
            const security = JSON.parse(_security!)

            if (!password.current || !password.new || !password.confirm) {
                toast.show("Password cannot be empty!", {
                    type: "danger"
                })
                return
            }

            if (password.new.length < 8) {
                toast.show("Password must be at least 8 characters", {
                    type: "danger"
                })
                return
            }

            if (password.current.trim() !== security.password) {
                toast.show("Incorrect password!", {
                    type: "danger"
                })
                return
            }

            if (password.current.trim() === password.new.trim()) {
                toast.show("Cannot use current password")
                return
            }

            if (password.new.trim() !== password.confirm.trim()) {
                toast.show("Passwords do not match!", {
                    type: "danger"
                })
                return
            }

            await SInfo.setItem("security", JSON.stringify({ ...security, password: password.new.trim() }), {
                sharedPreferencesName: "sern.android.storage",
                keychainService: "sern.ios.storage",
            })

            closeModal()

            toast.show("Password Changed Successfully", { type: "success" })
        } catch (error) {
            toast.show("Failed to change password", { type: "danger" })
        }
    }

    useEffect(() => {
        // set suggested password
        setSuggestion(generate({ exactly: 2, join: "", minLength: 4, maxLength: 5 }))
    }, [])
    return (
        <VStack bgColor="white" borderRadius="30" p="5" space={4} w={WINDOW_WIDTH * 0.9}>
            <PasswordInput label="Current Password" value={password.current} infoText={password.current.length < 8 && 'Must be at least 8 characters'} onChange={value => setPassword(password => ({ ...password, current: value }))} />
            <PasswordInput label="New Password" value={password.new} suggestion={suggestion} infoText={password.new.length < 8 && 'Must be at least 8 characters'} onChange={value => setPassword(password => ({ ...password, new: value }))} />
            <PasswordInput label="Confirm Password" value={password.confirm} suggestion={suggestion} infoText={password.confirm.length < 8 && 'Must be at least 8 characters'} onChange={value => setPassword(password => ({ ...password, confirm: value }))} />

            <Button text="Change Password" loading={false} onPress={change} style={{ marginTop: 10 }} />
        </VStack>
    )
}