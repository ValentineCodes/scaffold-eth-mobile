import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useReducer } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { ActivityIndicator, Card, Text, useTheme } from 'react-native-paper';
import Address from '../../../../../../components/scaffold-eth/Address';
import Balance from '../../../../../../components/scaffold-eth/Balance';
import { useDeployedContractInfo } from '../../../../../../hooks/scaffold-eth/useDeployedContractInfo';
import useNetwork from '../../../../../../hooks/scaffold-eth/useNetwork';
import globalStyles from '../../../../../../styles/globalStyles';
import { COLORS } from '../../../../../../utils/constants';
import { FONT_SIZE } from '../../../../../../utils/styles';
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
  const network = useNetwork();
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
        style={{
          marginTop: 48,
          fontSize: FONT_SIZE['xl'],
          ...globalStyles.text
        }}
      >
        {`No contract found by the name of "${contractName}" on chain "${network.name}". Are you on the right network?`}
      </Text>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Card
        style={{
          backgroundColor: 'white',
          marginBottom: 24,
          borderWidth: 1,
          borderRadius: 12,
          borderColor: COLORS.gray
        }}
      >
        <Card.Content>
          <Text
            variant="titleLarge"
            style={{ marginBottom: 8, ...globalStyles.text }}
          >
            {contractName}
          </Text>
          <Address address={deployedContractData.address} />
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
          >
            <Text style={[globalStyles.text, { fontSize: FONT_SIZE['md'] }]}>
              Balance:{' '}
            </Text>
            <Balance address={deployedContractData.address} />
          </View>
          {network && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4
              }}
            >
              <Text style={[globalStyles.text, { fontSize: FONT_SIZE['md'] }]}>
                Network:{' '}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.primary, ...globalStyles.text }}
              >
                {network.name}
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
            marginBottom: -15
          }}
          contentStyle={{ marginTop: -8 }}
        >
          <Card.Content>
            <Text
              style={{
                fontSize: FONT_SIZE['md'],
                ...globalStyles.textMedium,
                marginBottom: Platform.OS === 'ios' ? 4 : 0
              }}
            >
              Read
            </Text>
          </Card.Content>
        </Card>
        <Card style={{ backgroundColor: 'white' }}>
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
            marginBottom: -15
          }}
          contentStyle={{ marginTop: -8 }}
        >
          <Card.Content>
            <Text
              style={{
                fontSize: FONT_SIZE['md'],
                ...globalStyles.textMedium,
                marginBottom: Platform.OS === 'ios' ? 4 : 0
              }}
            >
              Write
            </Text>
          </Card.Content>
        </Card>
        <Card style={{ backgroundColor: 'white' }}>
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
