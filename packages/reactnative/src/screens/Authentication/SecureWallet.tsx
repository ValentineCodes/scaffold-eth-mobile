import { Divider, ScrollView, Text, VStack, HStack, View } from 'native-base'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import Modal from "react-native-modal";

import ProgressIndicatorHeader from '../../components/headers/ProgressIndicatorHeader'
import { COLORS } from '../../utils/constants'
import { FONT_SIZE } from '../../utils/styles';
import BulletText from '../../components/BulletText'
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native';

type Props = {}

export default function SecureWallet({ }: Props) {
    const navigation = useNavigation()

    const [isSeedPhraseDescriptionVisible, setIsSeedPhraseDescriptionVisible] = useState(false)

    return (
        <View style={styles.container}>
            <ProgressIndicatorHeader progress={2} />

            <Divider bgColor="muted.100" mt="8" mb="4" />

            <ScrollView flex="1">
                <Text textAlign="center" color={COLORS.primary} fontSize={1.7 * FONT_SIZE["xl"]} bold>Secure Your Wallet</Text>
                <Text textAlign="center" fontSize={FONT_SIZE['lg']} my="2">Secure your wallet's "<Text color={COLORS.primary} onPress={() => setIsSeedPhraseDescriptionVisible(true)}>Seed Phrase</Text>"</Text>

                <Divider bgColor="muted.100" my="4" />

                <VStack space={4} mb="50">
                    <Text bold fontSize={FONT_SIZE['xl']}>Manual</Text>
                    <Text fontSize={FONT_SIZE['lg']}>Write down your seed phrase on a piece of paper and store in a safe place.</Text>

                    <Text fontSize={FONT_SIZE['lg']}>Security level: Very strong</Text>

                    <HStack alignItems="center" space={4}>
                        {Array(3).fill(null).map(_ => <Divider key={Math.random().toString()} w="12" h="1" bgColor={COLORS.primary} />)}
                    </HStack>

                    <VStack>
                        <Text fontSize={FONT_SIZE['lg']}>Risks are:</Text>
                        <BulletText text="You lose it" />
                        <BulletText text="You forget where you put it" />
                        <BulletText text="Someone else finds it" />
                    </VStack>

                    <Text fontSize={FONT_SIZE['lg']}>Other options: Doesn't have to be paper!</Text>

                    <VStack>
                        <Text fontSize={FONT_SIZE['lg']}>Tips:</Text>
                        <BulletText text="Store in bank vault" />
                        <BulletText text="Store in a safe" />
                        <BulletText text="Store in multiple secret places" />
                    </VStack>

                    <Divider bgColor="muted.100" mt="10" />

                    <Button text="Start" onPress={() => navigation.navigate("GenerateSeedPhrase")} />
                </VStack>

                <Modal isVisible={isSeedPhraseDescriptionVisible} animationIn="slideInUp" animationOut="slideOutDown" onBackdropPress={() => setIsSeedPhraseDescriptionVisible(false)} onBackButtonPress={() => setIsSeedPhraseDescriptionVisible(false)} style={{ justifyContent: "flex-end" }}>
                    <VStack space={4} bgColor="white" borderTopLeftRadius={40} borderTopRightRadius={40} p="5">
                        <Text textAlign="center" fontSize="2xl" bold>What is a "Seed Phrase"?</Text>

                        <Divider bgColor="muted.100" my="2" />

                        <Text fontSize="md">A seed phrase is a set of twelve words that contains all the information about your wallet, including your funds. It's like a secret code used to access your entire wallet.</Text>
                        <Text fontSize="md">You must keep your seed phrase secret and safe. If someone gets your seed phrase, they'll gain control over your accounts.</Text>
                        <Text fontSize="md">Save it in a place where only you can access it. If you lose it, not even Paux can help you recover it.</Text>

                        <Divider bgColor="muted.100" my="2" />

                        <Button text="OK, I Got It" onPress={() => setIsSeedPhraseDescriptionVisible(false)} />
                    </VStack>
                </Modal>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 15
    }
})