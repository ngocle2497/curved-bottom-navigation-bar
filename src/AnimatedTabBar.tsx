import React, { useMemo, useCallback, useEffect, memo } from 'react';
import Animated, {
  useSharedValue,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { CommonActions, Route } from '@react-navigation/native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import isEqual from 'react-fast-compare';

import type {
  TabsConfigsType,
  TabBarAnimationConfigurableProps,
} from './types';
import { CurvedTabBar } from './curved/CurvedTabBar';
import {
  SIZE_DOT,
  TAB_BAR_COLOR,
  DEFAULT_ITEM_ANIMATION_DURATION,
  TAB_BAR_HEIGHT,
} from './curved/constant';
Animated.addWhitelistedNativeProps({
  width: true,
  stroke: true,
  backgroundColor: true,
});

interface AnimatedTabBarProps
  extends Pick<BottomTabBarProps, 'state' | 'navigation' | 'descriptors'>,
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
    duration = DEFAULT_ITEM_ANIMATION_DURATION,
    barColor = TAB_BAR_COLOR,
    dotSize = SIZE_DOT,
    dotColor = TAB_BAR_COLOR,
    titleShown = false,
    state,
  } = props;

  // variables
  const isReactNavigation5 = useMemo(() => (state ? true : false), [state]);
  const {
    routes,
    index: navigationIndex,
    key: navigationKey,
  }: { routes: Route<string>[]; index: number; key: string } = useMemo(() => {
    if (isReactNavigation5) {
      return state;
    } else {
      return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        index: navigation.state.index,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        routes: navigation.state.routes,
        key: '',
      };
    }
  }, [navigation, state, isReactNavigation5]);

  // reanimated
  const selectedIndex = useSharedValue(0);

  // callbacks
  const getRouteTitle = useCallback(
    (route: Route<string>) => {
      if (isReactNavigation5) {
        const { options } = descriptors[route.key];
        // eslint-disable-next-line no-nested-ternary
        return options.tabBarLabel !== undefined &&
          typeof options.tabBarLabel === 'string'
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;
      } else {
        return route.key;
      }
    },
    [isReactNavigation5, descriptors]
  );

  const getRouteTabConfigs = useCallback(
    (route: Route<string>) => {
      if (isReactNavigation5) {
        return tabs[route.name];
      } else {
        return tabs[route.key];
      }
    },
    [isReactNavigation5, tabs]
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
      if (isReactNavigation5) {
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
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { onTabPress } = props;
        onTabPress({ route: routes[index] });
      }
    },
    [isReactNavigation5, routes, navigation, navigationKey, props]
  );

  // Effects

  useEffect(() => {
    selectedIndex.value = navigationIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationIndex]);

  useAnimatedReaction(
    () => selectedIndex.value,
    (nextSelected) => {
      runOnJS(handleSelectedIndexChange)(nextSelected);
    },
    [selectedIndex, handleSelectedIndexChange]
  );

  // render
  return (
    <CurvedTabBar
      titleShown={titleShown}
      dotColor={dotColor}
      barHeight={TAB_BAR_HEIGHT}
      dotSize={dotSize}
      tabBarColor={barColor}
      selectedIndex={selectedIndex}
      routes={getRoutes()}
      duration={duration}
    />
  );
};
export const AnimatedTabBar = memo(AnimatedTabBarComponent, isEqual);
