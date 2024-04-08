import { HStack, Input, Text, Box } from 'native-base'
import { FlatList, Pressable } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/Ionicons"

const TOKENS = [
    {
        name: "BuidlGuidl",
        symbol: "BG",
        address: "0xF51CD0d607c82db2B70B678554c52C266a9D49B6",
        balance: "99.5"
    }, {
        name: "AfterLife",
        symbol: "AL",
        address: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D901",
        balance: "15.5"
    }
]

type Props = {}

function Tokens({ }: Props) {
    return (
        <Box>
            <HStack alignItems="center" justifyContent="space-between" py={2}>
                <Input size="xl" placeholder="Search tokens" w="85%" />
                <Icon name="add" size={30} style={{ color: "white", backgroundColor: "blue", padding: 5 }} />
            </HStack>

            <FlatList ItemSeparatorComponent={() => <Box borderBottomWidth={1} borderBottomColor="#ccc" />} keyExtractor={token => token.address} data={TOKENS} renderItem={({ item }) => (
                <Pressable style={{ paddingVertical: 5 }}>
                    <Text fontSize="lg" bold>{item.name}</Text>
                    <Text>{item.balance}</Text>
                </Pressable>
            )} />
        </Box>
    )
}

export default Tokens