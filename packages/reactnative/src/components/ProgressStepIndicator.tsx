import { Divider, HStack, View } from 'native-base'
import React from 'react'
import { COLORS } from '../utils/constants';

type Props = {
    steps: number;
    progress: number;
    width?: string | number;
    size?: number;
}

export default function ProgressStepIndicator({ steps, progress, width, size }: Props) {
    return (
        <HStack w={width || 200}>
            {Array(steps - 1).fill(null).map((_, index) => <Divider key={Math.random().toString()} w={`${100 / (steps - 1)}%`} h="0.5" bgColor={index <= progress - 2 ? COLORS.primary : "muted.200"} />)}

            <HStack style={{
                position: "absolute",
                top: -(size / 2 || 10),
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                {Array(steps).fill(null).map((_, index) => <View key={Math.random().toString()} style={{ width: size || 20, aspectRatio: 1, borderRadius: 100 }} bgColor={index <= progress - 1 ? COLORS.primary : "muted.200"} />)}

            </HStack>
        </HStack>
    )
}