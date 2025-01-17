import { getRandomValues } from 'react-native-quick-crypto';

global.getRandomValues = getRandomValues;
export * from '@ethersproject/shims';
