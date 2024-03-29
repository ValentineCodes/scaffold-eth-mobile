import React from 'react'
import { ActivityIndicator } from 'react-native'
import { Button as RNButton, Text } from "native-base"
import { COLORS } from '../utils/constants'

type Props = {
  text: string;
  type?: "normal" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  onPress: () => void;
}

export default function Button({ text, type, loading, disabled, style, onPress }: Props) {
  if (type === "outline") {
    return <RNButton py="4" borderRadius={25} bgColor="#E8F7ED" disabled={disabled || loading} style={[style]} w="full" onPress={onPress} _pressed={{ backgroundColor: 'rgba(39, 184, 88, 0.2)' }}>{loading ? <ActivityIndicator color={COLORS.primary} /> : <Text color={COLORS.primary} bold fontSize="md">{text}</Text>
    }</RNButton >
  }
  return (
    <RNButton py="4" borderRadius={25} bgColor={disabled ? "#2A974D" : COLORS.primary} disabled={disabled || loading} style={[style]} w="full" onPress={onPress} _pressed={{ opacity: 0.8 }}>{loading ? <ActivityIndicator color="white" /> : <Text color="white" bold fontSize="md">{text}</Text>}</RNButton >
  )
}