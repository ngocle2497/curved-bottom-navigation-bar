import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
});

interface ProfileProps {}

const ProfileComponent = ({}: ProfileProps) => {
  return <View style={[styles.body]} />;
};

export const Profile = memo(ProfileComponent, isEqual);
