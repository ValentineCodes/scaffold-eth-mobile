import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WINDOW_WIDTH } from '../../utils/styles';
import BackButton from '../buttons/BackButton';
import ProgressStepIndicator from '../ProgressStepIndicator';

type Props = {
  progress: number;
};

const ProgressIndicatorHeader = ({ progress }: Props) => {
  return (
    <View style={styles.container}>
      <BackButton />
      <View
        style={{
          position: 'absolute',
          top: 3.5,
          left: WINDOW_WIDTH * 0.23
        }}
      >
        <ProgressStepIndicator
          steps={3}
          progress={progress}
          width={WINDOW_WIDTH * 0.5}
          size={WINDOW_WIDTH * 0.04}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default ProgressIndicatorHeader;
