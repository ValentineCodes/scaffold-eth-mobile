/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import 'fast-text-encoding';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { name as appName } from './app.json';
import App from './src/screens/App';
import { persistor, store } from './src/store';

function Application() {
  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <PaperProvider>
            <App />
          </PaperProvider>
        </ToastProvider>
      </PersistGate>
    </StoreProvider>
  );
}

AppRegistry.registerComponent(appName, () => Application);
