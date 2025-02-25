/**
 * @format
 */

import { install } from 'react-native-quick-crypto';
import 'react-native-url-polyfill/auto';
import 'fast-text-encoding';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/screens/App';
import Providers from './src/screens/Providers';

install();

function Application() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}

AppRegistry.registerComponent(appName, () => Application);
