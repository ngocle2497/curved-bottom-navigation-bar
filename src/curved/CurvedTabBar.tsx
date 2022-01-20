/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {memo, useMemo} from 'react';
import {View, ViewStyle, StyleProp, useWindowDimensions} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import isEqual from 'react-fast-compare';

import type {TabBarViewProps} from '../types';
import {
  sharedTiming,
  useInterpolate,
  sharedEq,
  withSharedTransition,
} from '../AnimatedHelper';

import {Dot} from './item/Dot';
import {ButtonTab} from './item/ButtonTabItem';
import {styles} from './style';
import {HEIGHT_HOLE} from './constant';
import {RNShadow} from '../RNShadow';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const CurvedTabBarComponent = (props: TabBarViewProps) => {
  // props
  const {
    routes,
    selectedIndex,
    dotSize: SIZE_DOT,
    barHeight: TAB_BAR_HEIGHT,
    duration,
    dotColor,
    tabBarColor,
    titleShown,
  } = props;

  // state
  const {width} = useWindowDimensions();
  const {bottom} = useSafeAreaInsets();
  const widthTab = useMemo(() => width / routes.length, [routes, width]);

  // reanimated
  const indexAnimated = useDerivedValue(() =>
    sharedTiming(selectedIndex.value, {duration}),
  );
  const progress = withSharedTransition(sharedEq(selectedIndex, indexAnimated));

  const inputRange = useMemo(
    () => routes.map((_: any, index: number) => index),
    [routes],
  );

  const outputRange = routes
    .map((_: any, index: number) => -(((index + 1) * width) / routes.length))
    .reverse();

  const translateX = useInterpolate(indexAnimated, inputRange, outputRange);

  // path
  const d = useMemo(
    () =>
      `M0,0 L${width + widthTab / 2 - SIZE_DOT},0
    C${width + widthTab / 2 - SIZE_DOT * 0.5},0 ${
        width + widthTab / 2 - SIZE_DOT * 0.75
      },${HEIGHT_HOLE} ${width + widthTab / 2},${HEIGHT_HOLE} 
    C${width + widthTab / 2 + SIZE_DOT * 0.75},${HEIGHT_HOLE} ${
        width + widthTab / 2 + SIZE_DOT * 0.5
      },0 ${width + widthTab / 2 + SIZE_DOT} 0 
    L${width * 2},0 L ${width * 2},${TAB_BAR_HEIGHT} L 0,${TAB_BAR_HEIGHT} Z
    `,
    [width, widthTab, SIZE_DOT, TAB_BAR_HEIGHT],
  );

  // style
  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        height: TAB_BAR_HEIGHT,
        bottom: bottom,
      },
    ],
    [TAB_BAR_HEIGHT, bottom],
  );
  const svgStyle = useAnimatedStyle(() => ({
    height: TAB_BAR_HEIGHT,
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));
  const rowTab = useMemo(
    () => [{bottom: bottom, width: width, height: TAB_BAR_HEIGHT}],
    [bottom, TAB_BAR_HEIGHT, width],
  );

  const bottomView = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        height: bottom,
        width: width,
        backgroundColor: tabBarColor,
      },
    ],
    [bottom, width, tabBarColor],
  );

  return (
    <>
      <RNShadow style={[styles.container, containerStyle]}>
        <AnimatedSvg
          width={width * 2}
          height={TAB_BAR_HEIGHT}
          style={[styles.svg, svgStyle]}>
          <Path
            d={`${d}`}
            translateY={3}
            fill={tabBarColor}
            stroke={'transparent'}
            strokeWidth={0}
          />
        </AnimatedSvg>
      </RNShadow>
      <View style={[styles.rowTab, rowTab]}>
        <Dot
          dotColor={dotColor}
          dotSize={SIZE_DOT}
          barHeight={TAB_BAR_HEIGHT}
          width={width}
          selectedIndex={indexAnimated}
          routes={routes}
          progress={progress}
        />
        {routes.map(({key, title, ...configs}, index) => {
          return (
            <ButtonTab
              width={width}
              key={key}
              title={title}
              titleShown={titleShown}
              indexAnimated={indexAnimated}
              countTab={routes.length}
              selectedIndex={selectedIndex}
              index={index}
              {...configs}
            />
          );
        })}
      </View>
      <View style={[styles.bottomView, bottomView]} />
    </>
  );
};

export const CurvedTabBar = memo(CurvedTabBarComponent, isEqual);
