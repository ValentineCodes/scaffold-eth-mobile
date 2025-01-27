import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Blockie from '../../../components/Blockie';
import { clearRecipients } from '../../../store/reducers/Recipients';
import { COLORS } from '../../../utils/constants';
import { truncateAddress } from '../../../utils/helperFunctions';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  onSelect: (recipient: string) => void;
};

export default function PastRecipients({ onSelect }: Props) {
  const recipients: string[] = useSelector((state: any) => state.recipients);
  const dispatch = useDispatch();

  const clear = () => {
    dispatch(clearRecipients());
  };

  return (
    <View style={styles.container}>
      {recipients.length > 0 && (
        <>
          <View style={styles.header}>
            <Text variant="titleLarge">Recents</Text>
            <TouchableOpacity onPress={clear}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            keyExtractor={item => item}
            data={recipients}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                style={styles.addressContainer}
              >
                <Blockie address={item} size={1.7 * FONT_SIZE['xl']} />
                <Text variant="titleMedium" style={styles.address}>
                  {truncateAddress(item)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  clearText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '500'
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  address: {
    marginLeft: 16
  }
});
