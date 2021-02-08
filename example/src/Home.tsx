import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

interface HomeProps {}

const HomeComponent = ({}: HomeProps) => {
  return <View style={[styles.body]} />;
};

export const Home = memo(HomeComponent, isEqual);
