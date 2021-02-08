import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#8e44ad',
  },
});

interface CreateProps {}

const CreateComponent = ({}: CreateProps) => {
  return <View style={[styles.body]} />;
};

export const Create = memo(CreateComponent, isEqual);
