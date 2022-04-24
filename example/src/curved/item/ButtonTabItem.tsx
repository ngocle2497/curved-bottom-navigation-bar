import React, {memo, useMemo, useCallback} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Animated, {
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import isEqual from 'react-fast-compare';

import type {TabBarItemProps} from '../../types';
import {sharedRound, sharedTiming, useInterpolate} from '../../AnimatedHelper';

import {styles} from './style';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ButtonTabItemComponent = (props: TabBarItemProps) => {
  // props
  const {
    index,
    selectedIndex,
    countTab,
    indexAnimated,
    width,
    icon,
    renderTitle,
    title,
    titleShown,
    focused,
  } = props;
  // reanimated
  const {bottom} = useSafeAreaInsets();
  const isActive = useDerivedValue(() => sharedRound(indexAnimated.value));
  const progress = useSharedValue(0);

  const opacity = useInterpolate(progress, [0, 0.8], [1, 0]);
  const translateY = useInterpolate(progress, [0, 0.4], [0, 10]);
  const scale = useInterpolate(progress, [0, 1], [1, 0.5]);

  // func
  const _onPress = useCallback(() => {
    selectedIndex.value = index;
  }, [index, selectedIndex]);

  // effect
  useAnimatedReaction(
    () => isActive.value === index,
    (result, prevValue) => {
      if (result !== prevValue) {
        progress.value = sharedTiming(result ? 1 : 0);
      }
    },
  );

  // reanimated style
  const containerIconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const buttonTab = useMemo(
    () => ({
      width: width / countTab,
      paddingBottom: bottom,
    }),
    [width, countTab, bottom],
  );

  // render
  const renderIcon = useCallback(() => {
    return icon({progress, focused});
  }, [focused, icon, progress]);

  const _renderTitle = useCallback(() => {
    return renderTitle?.({progress, focused, title: title ?? ''});
  }, [focused, progress, renderTitle, title]);

  const showTitle = useCallback(() => {
    if (typeof renderTitle === 'function') {
      return _renderTitle();
    }
    return (
      <Animated.Text
        style={[styles.title, titleStyle]}
        allowFontScaling={false}
        numberOfLines={1}>
        {title ?? ''}
      </Animated.Text>
    );
  }, [_renderTitle, renderTitle, title, titleStyle]);

  // render
  return (
    <TouchableOpacity onPress={_onPress} activeOpacity={0.7}>
      <View style={[styles.buttonTab, buttonTab]}>
        <Animated.View style={[containerIconStyle]}>
          {renderIcon()}
          {titleShown ? showTitle() : null}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export const ButtonTab = memo(ButtonTabItemComponent, isEqual);
