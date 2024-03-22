/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import "fast-text-encoding"
import { AppRegistry } from 'react-native';
import App from './src/screens/App';
import { name as appName } from './app.json';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-native-toast-notifications'
import { persistor, store } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';

function Application() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ToastProvider>
                    <NativeBaseProvider>
                        <App />
                    </NativeBaseProvider>
                </ToastProvider>
            </PersistGate>
        </Provider>
    );
}

AppRegistry.registerComponent(appName, () => Application);