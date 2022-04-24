import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { I18nManager } from 'react-native';
import isEqual from 'react-fast-compare';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions, Route } from '@react-navigation/native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import {
  DEFAULT_ITEM_ANIMATION_DURATION,
  SIZE_DOT,
  TAB_BAR_COLOR,
  TAB_BAR_HEIGHT,
} from './curved/constant';
import { CurvedTabBar } from './curved/CurvedTabBar';
import type {
  TabBarAnimationConfigurableProps,
  TabsConfigsType,
} from './types';

Animated.addWhitelistedNativeProps({
  width: true,
  stroke: true,
  backgroundColor: true,
});

interface AnimatedTabBarProps
  extends BottomTabBarProps,
    TabBarAnimationConfigurableProps {
  /**
   * Tabs configurations.
   */
  tabs: TabsConfigsType;

  /**
   * Overwrite background color of tabbar
   */
  barColor?: string;

  /**
   * Overwrite radius of dot
   */
  dotSize?: number;

  /**
   * Overwrite height of tabbar
   */
  barHeight?: number;
  /**
   * Overwrite width of tabbar
   */
  barWidth?: number;

  /**
   * Custom dot color
   */
  dotColor?: string;

  /**
   * Show title or not
   * @default false
   */
  titleShown?: boolean;
}
const AnimatedTabBarComponent = (props: AnimatedTabBarProps) => {
  // props
  const {
    navigation,
    tabs,
    descriptors,
    state,
    duration = DEFAULT_ITEM_ANIMATION_DURATION,
    barColor = TAB_BAR_COLOR,
    dotSize = SIZE_DOT,
    barHeight = TAB_BAR_HEIGHT,
    dotColor = TAB_BAR_COLOR,
    titleShown = false,
    barWidth,
  } = props;

  // variables

  const {
    routes,
    index: navigationIndex,
    key: navigationKey,
  } = useMemo(() => {
    return state;
  }, [state]);

  // reanimated
  const selectedIndex = useSharedValue(0);

  // callbacks
  const getRouteTitle = useCallback(
    (route: Route<string>) => {
      const { options } = descriptors[route.key];
      // eslint-disable-next-line no-nested-ternary
      return options.tabBarLabel !== undefined &&
        typeof options.tabBarLabel === 'string'
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;
    },
    [descriptors]
  );

  const getRouteTabConfigs = useCallback(
    (route: Route<string>) => {
      return tabs[route.name];
    },
    [tabs]
  );

  const getRoutes = useCallback(() => {
    return routes.map((route) => ({
      key: route.key,
      title: getRouteTitle(route),
      ...getRouteTabConfigs(route),
    }));
  }, [routes, getRouteTitle, getRouteTabConfigs]);

  const handleSelectedIndexChange = useCallback(
    (index: number) => {
      const { key, name } = routes[index];
      const event = navigation.emit({
        type: 'tabPress',
        target: key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.dispatch({
          ...CommonActions.navigate(name),
          target: navigationKey,
        });
      }
    },
    [routes, navigation, navigationKey]
  );

  // effects
  useEffect(() => {
    selectedIndex.value = navigationIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationIndex]);

  useAnimatedReaction(
    () => selectedIndex.value,
    (nextSelected, prevSelected) => {
      if (nextSelected !== prevSelected) {
        runOnJS(handleSelectedIndexChange)(nextSelected);
      }
    },
    [selectedIndex, handleSelectedIndexChange]
  );

  // render
  return (
    <CurvedTabBar
      isRtl={I18nManager.isRTL}
      barWidth={barWidth}
      titleShown={titleShown}
      dotColor={dotColor}
      barHeight={barHeight}
      dotSize={dotSize}
      tabBarColor={barColor}
      selectedIndex={selectedIndex}
      navigationIndex={navigationIndex}
      routes={getRoutes()}
      duration={duration}
    />
  );
};
export const AnimatedTabBar = memo(AnimatedTabBarComponent, isEqual);
