import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { BackHandler, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {};

export default function Onboarding({}: Props) {
  const navigation = useNavigation();

  const handleNav = () => {
    // @ts-ignore
    navigation.navigate('WalletSetup');
  };

  useFocusEffect(
    useCallback(() => {
      const backhandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          BackHandler.exitApp();

          return true;
        }
      );

      return () => backhandler.remove();
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      style={styles.container}
    >
      <View style={{ width: '100%', aspectRatio: 1 }}>
        <Image
          source={require('../../assets/images/work_bg.png')}
          style={{
            width: '100%',
            height: '100%'
          }}
          resizeMode="cover"
        />

        <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <Image
            source={require('../../assets/images/work_in_beanbag.png')}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Happy Coding
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Our goal is to ensure that you have everything you need to feel
          comfortable, confident, and ready to make an impact.
        </Text>

        <Button
          mode="contained"
          onPress={handleNav}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Let's Get Started
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  content: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20
  },
  title: {
    color: COLORS.primary,
    fontSize: FONT_SIZE['xl'] * 1.8,
    ...globalStyles.textBold
  },
  subtitle: {
    fontSize: FONT_SIZE['md'],
    marginVertical: 16,
    color: '#7D94A0',
    ...globalStyles.text
  },
  button: {
    marginTop: 20,
    marginBottom: 50,
    paddingVertical: 5
  },
  buttonText: {
    color: 'white',
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  }
});
