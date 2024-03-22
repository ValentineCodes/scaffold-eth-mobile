/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import "fast-text-encoding"
import {AppRegistry} from 'react-native';
import App from './src/screens/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
