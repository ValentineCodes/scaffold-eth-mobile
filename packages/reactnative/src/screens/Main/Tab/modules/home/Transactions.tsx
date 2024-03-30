import React from 'react'
import { View, Text, FlatList, VStack, Icon, Image, Divider } from 'native-base'
import Transaction from '../../../../../components/Transaction'
import { ActivityIndicator, RefreshControl, StyleSheet } from 'react-native'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { COLORS } from '../../../../../utils/constants'
import { FONT_SIZE } from '../../../../../utils/styles'

export type LoadingTxStatusProps = 'loading' | 'success' | 'error';

type Props = {
  transactions: any[];
  loadingStatus: LoadingTxStatusProps;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  get: () => void;
  refresh: () => void;
  loadMore: () => void;
}

export default function Transactions({ transactions, loadingStatus, isLoadingMore, isRefreshing, get, refresh, loadMore }: Props) {
  return (
    <View style={{ flex: 1 }}>
      {loadingStatus === 'loading' ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={3 * FONT_SIZE['xl']} color={COLORS.primary} />
        </View>
      ) : loadingStatus === 'error' ? (
        <VStack flex="1" justifyContent="center" alignItems="center" space="4">
          <Image source={require("../../../../../assets/icons/failed_icon.png")} alt="Retry" style={styles.failedIcon} />
          <Text fontSize={1.1 * FONT_SIZE['lg']}>Failed to load transactions. <Text onPress={get} color={COLORS.primary} bold>Retry</Text></Text>
        </VStack>
      ) : transactions.length > 0 ? (
        <>
          <FlatList
            keyExtractor={(item) => item.timeStamp}
            data={transactions}
            renderItem={({ item }) => <Transaction tx={item} />}
            ItemSeparatorComponent={<Divider bgColor="muted.100" my="2" />}
            ListFooterComponent={isLoadingMore ? <View py="4"><ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingIndicator} /></View> : null}
            refreshControl={
              <RefreshControl
                onRefresh={refresh}
                refreshing={isRefreshing}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
          />
        </>
      ) : (
        <VStack flex="1" justifyContent="center" alignItems="center" space="4">
          <View bgColor={COLORS.primaryLight} p="4" borderRadius="full">
            <Icon as={<Ionicons name="swap-horizontal-outline" />} size={3 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
          </View>
          <Text fontSize={1.2 * FONT_SIZE['xl']} bold color="muted.400">No Transactions</Text>
        </VStack>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  loadingIndicator: {},
  failedIcon: {
    width: 7 * FONT_SIZE['xl'],
    height: 7 * FONT_SIZE['xl']
  }
})