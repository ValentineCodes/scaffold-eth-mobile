import { HStack, Text } from 'native-base'
import React from 'react'

type Props = {
    text: string
}

export default function BulletText({ text }: Props) {
    return (
        <HStack alignItems="center" space={2} ml="3">
            <Text fontSize="lg">*</Text>
            <Text fontSize="lg">{text}</Text>
        </HStack>
    )
}