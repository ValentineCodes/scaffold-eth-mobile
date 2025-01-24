import { keccak256, toUtf8Bytes } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Token } from '../store/reducers/Tokens';
import useAccount from './scaffold-eth/useAccount';
import useNetwork from './scaffold-eth/useNetwork';

export function useTokens() {
  // @ts-ignore
  const tokens = useSelector(state => state.tokens);

  const network = useNetwork();
  const account = useAccount();

  const [importedTokens, setImportedTokens] = useState<Token[]>();

  function setTokens() {
    const key = keccak256(
      toUtf8Bytes(`${network.id}${account.address.toLowerCase()}`)
    );
    setImportedTokens(tokens[key]);
  }

  useEffect(() => {
    setTokens();
  }, []);
  return {
    tokens: importedTokens
  };
}
