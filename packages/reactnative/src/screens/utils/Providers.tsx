import React from 'react'

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { MenuProvider } from 'react-native-popup-menu';

import '@walletconnect/react-native-compat'
import { WagmiConfig } from 'wagmi'
import { mainnet, sepolia } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig, Web3Modal } from '@web3modal/wagmi-react-native'
import { NativeBaseProvider } from 'native-base';

type Props = {
    children: JSX.Element
}

const projectId = 'a39dc988eb0f5102c30bb2f38d1cfd55'

const metadata = {
    name: 'Scaffold-Eth React Native',
    description: 'React Native Starter kit for building dApps',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    redirect: {
        native: 'YOUR_APP_SCHEME://',
        universal: 'YOUR_APP_UNIVERSAL_LINK.com'
    }
}

const chains = [mainnet, sepolia]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
    projectId,
    chains,
    wagmiConfig
})


export default function Providers({ children }: Props) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <ToastProvider>
                <MenuProvider>
                    <SafeAreaProvider>
                        <NativeBaseProvider>
                            {children}
                        </NativeBaseProvider>
                    </SafeAreaProvider>
                </MenuProvider>
            </ToastProvider>
            <Web3Modal />
        </WagmiConfig>
    )
}