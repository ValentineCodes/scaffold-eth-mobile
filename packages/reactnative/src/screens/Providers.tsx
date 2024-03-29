import React from 'react'

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { MenuProvider } from 'react-native-popup-menu';

type Props = {
  children: JSX.Element
}

export default function Providers({ children }: Props) {
  return (
    <ToastProvider>
      <MenuProvider>
        <SafeAreaProvider>
          {children}
        </SafeAreaProvider>
      </MenuProvider>
    </ToastProvider>
  )
}