import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useReducer } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Card, Text, useTheme } from 'react-native-paper';
import Address from '../../../../../../components/scaffold-eth/Address';
import Balance from '../../../../../../components/scaffold-eth/Balance';
import { useDeployedContractInfo } from '../../../../../../hooks/scaffold-eth/useDeployedContractInfo';
import useTargetNetwork from '../../../../../../hooks/scaffold-eth/useTargetNetwork';
import { COLORS } from '../../../../../../utils/constants';
import ContractReadMethods from './ContractReadMethods';
import ContractVariables from './ContractVariables';
import ContractWriteMethods from './ContractWriteMethods';

export default function ContractUI() {
  const route = useRoute();
  const isFocused = useIsFocused();
  const theme = useTheme();
  const contractName = route.name;
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(
    value => !value,
    false
  );
  const targetNetwork = useTargetNetwork();
  const { data: deployedContractData, isLoading: isDeployedContractLoading } =
    useDeployedContractInfo(contractName);

  if (isDeployedContractLoading || !isFocused) {
    return (
      <View style={{ marginTop: 48 }}>
        <ActivityIndicator
          animating={true}
          color={COLORS.primary}
          size="large"
        />
      </View>
    );
  }

  if (!deployedContractData) {
    return (
      <Text
        variant="headlineSmall"
        style={{ marginTop: 48, fontWeight: '300' }}
      >
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </Text>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Card style={{ marginBottom: 24 }}>
        <Card.Content>
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>
            {contractName}
          </Text>
          <Address address={deployedContractData.address} />
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
          >
            <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
              Balance:{' '}
            </Text>
            <Balance address={deployedContractData.address} />
          </View>
          {targetNetwork && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4
              }}
            >
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                Network:{' '}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.primary }}
              >
                {targetNetwork.name}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={{ marginBottom: 24, backgroundColor: COLORS.primaryLight }}>
        <Card.Content>
          <ContractVariables
            refreshDisplayVariables={refreshDisplayVariables}
            deployedContractData={deployedContractData}
          />
        </Card.Content>
      </Card>

      <View style={{ marginBottom: 24 }}>
        <Card
          style={{
            backgroundColor: COLORS.primaryLight,
            alignSelf: 'flex-start',
            marginBottom: -32,
            zIndex: 1
          }}
        >
          <Card.Content>
            <Text variant="titleLarge">Read</Text>
          </Card.Content>
        </Card>
        <Card style={{ paddingTop: 32 }}>
          <Card.Content>
            <ContractReadMethods deployedContractData={deployedContractData} />
          </Card.Content>
        </Card>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Card
          style={{
            backgroundColor: COLORS.primaryLight,
            alignSelf: 'flex-start',
            marginBottom: -32,
            zIndex: 1
          }}
        >
          <Card.Content>
            <Text variant="titleLarge">Write</Text>
          </Card.Content>
        </Card>
        <Card style={{ paddingTop: 32 }}>
          <Card.Content>
            <ContractWriteMethods
              deployedContractData={deployedContractData}
              onChange={triggerRefreshDisplayVariables}
            />
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}
