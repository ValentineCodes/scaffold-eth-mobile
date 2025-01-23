import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useDeployedContractInfo } from '../hooks/scaffold-eth/useDeployedContractInfo';
import useNetwork from '../hooks/scaffold-eth/useNetwork';
import Snowman from './Snowman';

export default function SnowmanList() {
  const [snowmen, setSnowmen] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const network = useNetwork();
  const { data: snowmanContract, isLoading: isLoadingSnowmanContract } =
    useDeployedContractInfo('Snowman');

  const getSnowmen = async () => {
    if (isLoadingSnowmanContract) return;

    try {
      setIsLoading(true);
      const provider = new ethers.JsonRpcProvider(network.provider);
      const ISnowman = new ethers.Contract(
        snowmanContract?.address,
        snowmanContract?.abi,
        provider
      );

      const balance = await ISnowman.balanceOf(network.account);
      const snowmenIds = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await ISnowman.tokenOfOwnerByIndex(network.account, i);
        snowmenIds.push(Number(tokenId));
      }

      setSnowmen(snowmenIds);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSnowmen();
  }, [isLoadingSnowmanContract]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text variant="bodyLarge">Loading snowmen...</Text>
      </View>
    );
  }

  if (!snowmen.length) {
    return (
      <View style={styles.container}>
        <Text variant="bodyLarge">No snowmen found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {snowmen.map(id => (
        <Snowman
          key={id}
          id={id}
          remove={() => {
            setSnowmen(prev => prev.filter(snowmanId => snowmanId !== id));
          }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    gap: 16,
    padding: 16
  }
});
