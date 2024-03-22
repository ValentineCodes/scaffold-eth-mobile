const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          crypto: 'react-native-quick-crypto',
          stream: 'stream-browserify',
          buffer: '@craftzdog/react-native-buffer',
          'bn.js': 'react-native-bignumber',
          '@ethersproject/pbkdf2': './utils/ethers-patch.js',
        },
      },
    ],
  ],
};
