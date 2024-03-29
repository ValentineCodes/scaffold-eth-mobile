import { HStack, View } from 'native-base'
import React from 'react'
import { FONT_SIZE } from '../../../utils/styles'

type Props = {}

export default function Recents({ }: Props) {
    const recipients: string[] = useSelector((state: any) => state.recipients)

    return (
        <View flex="1">
            <>
                <HStack alignItems="center" justifyContent="space-between">
                    <Text bold fontSize={FONT_SIZE['xl']}>Recents</Text>
                    <TouchableOpacity>
                        <Text color={COLORS.primary} fontSize={FONT_SIZE['lg']} fontWeight="medium">Clear</Text>
                    </TouchableOpacity>
                </HStack>

                <FlatList
                    keyExtractor={item => item}
                    data={recipients}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setToAddress(item)}>
                            <HStack alignItems="center" space="4" mb="4">
                                <Blockie address={item} size={1.7 * FONT_SIZE['xl']} />
                                <Text fontSize={FONT_SIZE['xl']} fontWeight="medium">{truncateAddress(item)}</Text>
                            </HStack>
                        </TouchableOpacity>
                    )}
                />
            </>
        </View>
    )
}