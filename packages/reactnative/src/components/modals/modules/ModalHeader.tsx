import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface IModalHeaderProps {
  name: string;
  url: string;
  icon: string;
}

//ToDo: QoL: Add in the Emoji scroll animation
export function ModalHeader({ name, url, icon }: IModalHeaderProps) {
  return (
    <View style={styles.modalHeaderContainer}>
      <View style={styles.imageRowContainer}>
        {icon ? (
          <Image
            source={{
              uri: icon
            }}
            style={styles.WCLogoLeft}
          />
        ) : null}
      </View>

      <Text variant="headlineSmall" style={styles.dappTitle}>
        {name}
      </Text>
      <Text variant="bodyLarge" style={styles.wouldLikeToConnectText}>
        would like to connect
      </Text>
      <Text variant="bodyMedium" style={styles.urlText}>
        {url?.slice(8)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageRowContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  WCLogoLeft: {
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -8,
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  WCLogoRight: {
    width: 60,
    height: 60,
    borderRadius: 8,
    left: -30,
    top: -8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  emojiContainer: {
    opacity: 0.8,
    width: 290,
    height: 44,
    borderRadius: 8,
    marginBottom: 8
  },
  dappTitle: {
    fontWeight: '700',
    color: 'black',
    textAlign: 'center'
  },
  wouldLikeToConnectText: {
    opacity: 0.6,
    color: 'black'
  },
  urlText: {
    paddingTop: 8,
    color: 'rgba(60, 60, 67, 0.6)',
    fontWeight: '500',
    textAlign: 'center'
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(60, 60, 67, 0.36)',
    marginVertical: 16
  }
});
