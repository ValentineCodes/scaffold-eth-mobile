import React, { useEffect } from 'react'
import { StyleSheet, Dimensions, BackHandler, NativeEventSubscription } from 'react-native'
import { ScrollView, Image, Text, VStack } from 'native-base'

import Button from '../../components/Button'
import { COLORS } from '../../utils/constants'
import { FONT_SIZE } from '../../utils/styles'
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
            <Image source={require("../../assets/images/pocket.jpg")} alt='Paux' style={{ width: Dimensions.get("window").height * 0.3, height: Dimensions.get("window").height * 0.3 }} />
            <VStack w="full" mt="10">
                <Text textAlign="center" color={COLORS.primary} fontSize={2 * FONT_SIZE["xl"]} bold>Welcome to Paux</Text>
                <Text textAlign="center" fontSize={FONT_SIZE["lg"]} my="4">A safe and secure crypto wallet to manage funds, interact with Dapps, sign transactions and more</Text>

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