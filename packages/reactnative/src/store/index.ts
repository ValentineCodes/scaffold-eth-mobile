import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Auth from './reducers/Auth';
import Networks from './reducers/Networks';
import Accounts from './reducers/Accounts';
import Transactions from './reducers/Transactions';
import Balance from './reducers/Balance';
import Recipients from './reducers/Recipients';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ["balance", "activeSessions", "networks"]
};

const reducers = combineReducers({
  auth: Auth,
  networks: Networks,
  accounts: Accounts,
  transactions: Transactions,
  balance: Balance,
  recipients: Recipients
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
