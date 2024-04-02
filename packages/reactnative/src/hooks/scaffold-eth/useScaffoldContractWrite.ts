import React, { useEffect } from 'react'
import { useModal } from 'react-native-modalfy'

export default function useScaffoldContractWrite() {
    const {openModal} = useModal()

    return openModal
}