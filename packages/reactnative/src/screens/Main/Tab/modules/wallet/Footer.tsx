import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import globalStyles from '../../../../../styles/globalStyles';
import { COLORS } from '../../../../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../../../../utils/styles';

type Feature = {
  title: string;
  icon: string;
  component: string;
};

const features: Feature[] = [
  { title: 'Tokens', icon: 'cash-outline', component: 'Tokens' },
  { title: 'NFTs', icon: 'images-outline', component: 'NFTs' },
  {
    title: 'Transactions',
    icon: 'swap-horizontal-outline',
    component: 'Transactions'
  }
];

const FeatureCard = ({ title, icon, component }: Feature) => {
  const navigation = useNavigation();

  return (
    <Card
      style={styles.featureCard}
      onPress={() => navigation.navigate(component)}
    >
      <Card.Content style={styles.featureContent}>
        <Ionicons name={icon} color="grey" size={WINDOW_WIDTH * 0.09} />
        <Text style={styles.featureTitle}>{title}</Text>
      </Card.Content>
    </Card>
  );
};

export default function Footer() {
  return (
    <View style={styles.container}>
      {features.map(feature => (
        <FeatureCard
          key={feature.title}
          title={feature.title}
          icon={feature.icon}
          component={feature.component}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.background,
    padding: 10
  },
  featureCard: {
    width: '48%', // Each item takes ~50% of the width
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  featureContent: {
    alignItems: 'center',
    gap: 10
  },
  featureTitle: {
    textAlign: 'center',
    fontSize: FONT_SIZE.lg,
    ...globalStyles.text
  }
});
