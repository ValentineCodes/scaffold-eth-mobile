import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import Accounts from './reducers/Accounts';
import Auth from './reducers/Auth';
import Balance from './reducers/Balance';
import Networks from './reducers/Networks';
import NFTs from './reducers/NFTs';
import Recipients from './reducers/Recipients';
import Tokens from './reducers/Tokens';
import Transactions from './reducers/Transactions';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['balance', 'networks', 'transactions']
};

const reducers = combineReducers({
  auth: Auth,
  networks: Networks,
  accounts: Accounts,
  transactions: Transactions,
  balance: Balance,
  recipients: Recipients,
  tokens: Tokens,
  nfts: NFTs
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);
