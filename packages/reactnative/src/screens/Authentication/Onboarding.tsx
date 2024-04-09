import React, { useEffect } from 'react'
import { StyleSheet, BackHandler, NativeEventSubscription } from 'react-native'
import { ScrollView, Image, Text, VStack } from 'native-base'

import Button from '../../components/Button'
import { COLORS } from '../../utils/constants'
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

let backHandler: NativeEventSubscription;

type Props = {}

export default function Onboarding({ }: Props) {
    const navigation = useNavigation()

    const handleNav = () => {
        navigation.navigate("WalletSetup")
        backHandler?.remove()
    }

    useFocusEffect(() => {
        backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();

            return true;
        });
    })

    useEffect(() => {
        return () => {
            backHandler?.remove();
        };
    }, [])

    return (
        <ScrollView contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }} style={styles.container}>
            <Image source={require("../../assets/images/logo.png")} alt='Scaffold-ETH' width={WINDOW_WIDTH * 0.3} height={WINDOW_WIDTH * 0.3} />
            <VStack w="full" mt="10">
                <Text textAlign="center" color={COLORS.primary} fontSize={2 * FONT_SIZE["xl"]} bold>Welcome to Scaffold-ETH</Text>
                <Text textAlign="center" fontSize={FONT_SIZE["lg"]} my="4">First, we'll need to setup a wallet. This will be unique to you and will be used to sign transactions, messages, and manage funds</Text>

                <Button text="Get Started" onPress={handleNav} style={{ marginTop: 40, marginBottom: 50 }} />
            </VStack>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        backgroundColor: 'white'
    }
})