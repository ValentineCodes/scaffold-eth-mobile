import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Surface, Text } from 'react-native-paper';
import Token from '../../../../../components/asset/Token';
import { useTokens } from '../../../../../hooks/useTokens';
import { COLORS } from '../../../../../utils/constants';
import { FONT_SIZE } from '../../../../../utils/styles';

type Props = {};

function Tokens({}: Props) {
  const { openModal } = useModal();
  const { tokens } = useTokens();
  const navigation = useNavigation();

  return (
    <Surface style={{ paddingTop: 75, padding: 2 }}>
      <Pressable
        onPress={() => openModal('ImportTokenModal')}
        style={styles.importTokenBtnContainer}
      >
        <Text style={styles.importTokenBtn}>Import Token</Text>
      </Pressable>

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
      />
    </Surface>
  );
}

export default Tokens;

const styles = StyleSheet.create({
  importTokenBtnContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10
  },
  importTokenBtn: {
    fontSize: FONT_SIZE['lg'],
    fontWeight: 'bold',
    color: COLORS.primary
  }
});
