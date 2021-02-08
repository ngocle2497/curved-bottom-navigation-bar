import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#686de0',
  },
});

interface LikesProps {}

const LikesComponent = ({}: LikesProps) => {
  return <View style={[styles.body]} />;
};

export const Likes = memo(LikesComponent, isEqual);
