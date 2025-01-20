/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import 'fast-text-encoding';
import { NativeBaseProvider } from 'native-base';
import { AppRegistry } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { name as appName } from './app.json';
import App from './src/screens/App';
import { persistor, store } from './src/store';

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
