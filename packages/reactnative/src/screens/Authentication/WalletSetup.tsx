import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { ScrollView, Image, Text, Icon, VStack, Pressable } from 'native-base'

import Button from '../../components/Button'
import { COLORS } from '../../utils/constants'
import { useNavigation } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { FONT_SIZE } from '../../utils/styles'

type Props = {}

export default function WalletSetup({ }: Props) {
    const navigation = useNavigation()
    return (
        <ScrollView contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }} style={styles.container}>
            <Pressable onPress={() => navigation.goBack()} _pressed={{ opacity: 0.4 }} style={styles.navBtn}>
                <Icon as={<Ionicons name="arrow-back-outline" />} size={1.3 * FONT_SIZE['xl']} color="black" />
            </Pressable>
            <Image source={require("../../assets/icons/wallet_icon.png")} alt='Paux' style={{ width: Dimensions.get("window").height * 0.3, height: Dimensions.get("window").height * 0.3 }} />

            <VStack w="full" mt="10">
                <Text textAlign="center" color={COLORS.primary} fontSize={2 * FONT_SIZE["xl"]} bold mt="10">Wallet Setup</Text>
                <Text textAlign="center" fontSize={FONT_SIZE["lg"]} my="4">Create your new Wallet or import using a seed phrase if you already have an account</Text>

                <Button text="Create a New Wallet" onPress={() => navigation.navigate("CreatePassword")} style={{ marginTop: 40 }} />
                <Button text="Import Using Seed Phrase" type="outline" onPress={() => navigation.navigate("ImportWallet")} style={{ marginTop: 20 }} />
            </VStack>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    navBtn: {
        position: "absolute",
        top: 15,
        left: 15
    }
})