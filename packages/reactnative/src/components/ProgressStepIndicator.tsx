import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../utils/constants';

type Props = {
  steps: number;
  progress: number;
  width?: string | number;
  size?: number;
};

export default function ProgressStepIndicator({
  steps,
  progress,
  width = 200,
  size = 20
}: Props) {
  return (
    <View style={[styles.container, { width }]}>
      {Array(steps - 1)
        .fill(null)
        .map((_, index) => (
          <View
            key={`divider-${index}`}
            style={[
              styles.divider,
              {
                width: `${100 / (steps - 1)}%`,
                backgroundColor:
                  index <= progress - 2 ? COLORS.primary : '#e5e5e5'
              }
            ]}
          />
        ))}

      <View
        style={[
          styles.dotsContainer,
          { width: '100%', position: 'absolute', top: -(size / 2 || 10) }
        ]}
      >
        {Array(steps)
          .fill(null)
          .map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  width: size,
                  height: size,
                  backgroundColor:
                    index <= progress - 1 ? COLORS.primary : '#e5e5e5'
                }
              ]}
            />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  divider: {
    height: 2
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dot: {
    borderRadius: 100
  }
});
