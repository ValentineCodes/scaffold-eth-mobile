import { BlurView } from '@react-native-community/blur';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
import { COLORS } from '../utils/constants';

type Props = {
  seedPhrase: string | undefined;
  onReveal?: () => void;
};

export default function SeedPhrase({ seedPhrase, onReveal }: Props) {
  const [show, setShow] = useState(false);

  const reveal = () => {
    setShow(true);
    if (!onReveal) return;
    onReveal();
  };
  return (
    <View style={styles.seedPhraseContainer}>
      <View style={styles.seedPhraseWrapper}>
        {seedPhrase?.split(' ').map((word, index) => (
          <Text key={word} style={styles.word}>
            {index + 1}. {word}
          </Text>
        ))}
      </View>

      {!show && (
        <>
          <BlurView
            style={styles.blurView}
            blurType="light"
            blurAmount={6}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.seedPhraseMask}>
            <Text
              variant="titleLarge"
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                ...globalStyles.text
              }}
            >
              Tap to reveal your seed phrase
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                textAlign: 'center',
                marginTop: 8,
                ...globalStyles.text
              }}
            >
              Make sure no one is watching your screen
            </Text>
            <Button
              mode="contained"
              icon="eye"
              onPress={reveal}
              style={styles.viewButton}
              labelStyle={{ color: 'white', ...globalStyles.text }}
            >
              View
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  seedPhraseContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 40,
    padding: 15
  },
  seedPhraseWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  word: {
    width: '45%',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    ...globalStyles.text
  },
  blurView: {
    position: 'absolute',
    top: -20,
    left: -20,
    bottom: -20,
    right: -20
  },
  seedPhraseMask: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  viewButton: {
    marginTop: 8,
    borderRadius: 25,
    backgroundColor: '#2AB858'
  }
});
