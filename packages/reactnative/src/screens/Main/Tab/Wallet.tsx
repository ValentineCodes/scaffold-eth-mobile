import { View } from 'native-base'
import React, { useEffect } from 'react'
import { BackHandler, NativeEventSubscription, StyleSheet } from 'react-native'
import Header from './modules/wallet/Header'
import MainBalance from './modules/wallet/MainBalance'
import Transactions from './modules/wallet/Transactions'
import { useFocusEffect } from '@react-navigation/native'

let backHandler: NativeEventSubscription;

type Props = {}

function Wallet({ }: Props) {
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
        <View style={styles.container}>
            <Header />
            <MainBalance
                backHandler={backHandler}
            />
            <Transactions />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 5,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    }
})
export default Wallet