import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { IconButton, Text } from 'react-native-paper';
import BackButton from '../../components/buttons/BackButton';
import { useTokens } from '../../hooks/scaffold-eth';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import Token from './modules/Token';

type Props = {};

export default function Tokens({}: Props) {
  const { openModal } = useModal();
  const { tokens } = useTokens();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton />
          <Text variant="titleLarge" style={globalStyles.textSemiBold}>
            Tokens
          </Text>
        </View>

        <IconButton
          icon="cloud-download"
          size={FONT_SIZE.xl * 1.7}
          iconColor={COLORS.primary}
          onPress={() => openModal('ImportTokenModal')}
        />
      </View>

      <FlatList
        data={tokens}
        keyExtractor={item => item.address}
        renderItem={({ item }) => (
          <Token
            address={item.address}
            name={item.name}
            symbol={item.symbol}
            onPress={() => {
              //@ts-ignore
              navigation.navigate('TokenDetails', { token: item });
            }}
          />
        )}
        style={{ paddingHorizontal: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
});
