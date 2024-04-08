import { Image, Text, VStack, Divider, Pressable, Icon, View, HStack } from 'native-base'
import React, { useState, useMemo } from 'react'
import { StyleSheet, ScrollView, RefreshControl } from 'react-native'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { useNavigation } from '@react-navigation/native'

import CopyableText from '../../../../../components/CopyableText'
import { truncateAddress } from '../../../../../utils/helperFunctions'
import { FONT_SIZE } from '../../../../../utils/styles'
import { COLORS } from '../../../../../utils/constants'
import ReceiveModal from '../../../../../components/modals/ReceiveModal'
import useBalance from '../../../../../hooks/scaffold-eth/useBalance'
import useAccount from '../../../../../hooks/scaffold-eth/useAccount'
import useNetwork from '../../../../../hooks/scaffold-eth/useNetwork'

type Props = {
  backHandler: any;
}

function MainBalance({ backHandler }: Props) {
  const network = useNetwork()
  const account = useAccount()
  const { balance, isRefetching, refetch } = useBalance({ address: account.address })

  const [showReceiveModal, setShowReceiveModal] = useState(false)

  const navigation = useNavigation()

  const logo = useMemo(() => {
    let _logo = require("../../../../../assets/images/eth-icon.png");

    if (["Polygon", "Mumbai"].includes(network.name)) {
      _logo = require("../../../../../assets/images/polygon-icon.png")
    } else if (["Arbitrum", "Arbitrum Goerli"].includes(network.name)) {
      _logo = require("../../../../../assets/images/arbitrum-icon.png")
    } else if (["Optimism", "Optimism Goerli"].includes(network.name)) {
      _logo = require("../../../../../assets/images/optimism-icon.png")
    }

    return <Image key={`${_logo}`} source={_logo} alt={network.name} style={styles.networkLogo} />
  }, [network])

  const handleNav = () => {
    navigation.navigate("Transfer")
    backHandler?.remove()
  }

  return (
    <ScrollView style={{ flexGrow: 0 }} refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.primary]} tintColor={COLORS.primary} />}>
      <VStack alignItems="center" space={2} paddingTop={5}>
        <Text fontSize={FONT_SIZE["xl"]} bold textAlign="center">{account.name}</Text>
        <CopyableText displayText={truncateAddress(account.address)} value={account.address} containerStyle={styles.addressContainer} textStyle={styles.addressText} iconStyle={{ color: COLORS.primary }} />
        {logo}
        <VStack alignItems="center">
          <Text fontSize={2 * FONT_SIZE["xl"]} bold textAlign="center">{balance !== '' && `${balance} ${network.currencySymbol}`}</Text>
        </VStack>

        <Divider bgColor="muted.100" my="2" />

        <HStack alignItems="center" space="10">
          <Pressable alignItems="center" onPress={handleNav}>
            {({ isPressed }) => (
              <>
                <View bgColor={isPressed ? 'rgba(39, 184, 88, 0.2)' : COLORS.primaryLight} p="4" borderRadius="full">
                  <Icon as={<Ionicons name="paper-plane" />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
                </View>
                <Text fontSize={FONT_SIZE["lg"]} bold mt="2">Send</Text>
              </>
            )}
          </Pressable>

          <Pressable alignItems="center" onPress={() => setShowReceiveModal(true)}>
            {({ isPressed }) => (
              <>
                <View bgColor={isPressed ? 'rgba(39, 184, 88, 0.2)' : COLORS.primaryLight} p="4" borderRadius="full">
                  <Icon as={<Ionicons name="download" />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
                </View>
                <Text fontSize={FONT_SIZE["lg"]} bold mt="2">Receive</Text>
              </>
            )}
          </Pressable>
        </HStack>

        <Divider bgColor="muted.100" mt="2" />

        <ReceiveModal isVisible={showReceiveModal} onClose={() => setShowReceiveModal(false)} />
      </VStack>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  networkLogo: {
    width: 4 * FONT_SIZE["xl"],
    height: 4 * FONT_SIZE["xl"],
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 15
  },
  addressText: {
    fontWeight: '700',
    fontSize: FONT_SIZE['md'],
    color: COLORS.primary
  }
})

export default MainBalance