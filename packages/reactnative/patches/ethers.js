import * as ethers from 'ethers';
import { pbkdf2Sync } from 'react-native-quick-crypto';

// Register the custom pbkdf2 function
ethers.pbkdf2.register(function (password, salt, iterations, keylen, algo) {
  return ethers.hexlify(pbkdf2Sync(password, salt, iterations, keylen, algo));
});

export { ethers };
