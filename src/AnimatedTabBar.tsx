import React, { useMemo, useCallback, useEffect } from 'react';
import Animated, { useCode, call, set } from 'react-native-reanimated';
import { useValues } from 'react-native-redash';
import { CommonActions, Route } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  TabsConfigsType,
  TabBarAnimationConfigurableProps,
} from './types';
import CurvedTabBar from './curved/CurvedTabBar'
import { SIZE_DOT, TAB_BAR_COLOR, DEFAULT_ITEM_ANIMATION_DURATION, TAB_BAR_HEIGHT } from './curved/constant';
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

  barColor?: string;

  dotSize?: number;

  dotColor?: string;

}

export const AnimatedTabBar = (props: AnimatedTabBarProps) => {
  // props
  const {
    navigation,
    tabs,
    descriptors,
    duration = DEFAULT_ITEM_ANIMATION_DURATION,
    barColor = TAB_BAR_COLOR,
    dotSize = SIZE_DOT,
    dotColor = TAB_BAR_COLOR,
  } = props;

  // variables
  const isReactNavigation5 = props.state ? true : false;
  // @ts-ignore
  const {
    routes,
    index: navigationIndex,
    key: navigationKey,
  }: { routes: Route<string>[]; index: number; key: string } = useMemo(() => {
    if (isReactNavigation5) {
      return props.state;
    } else {
      return {
        // @ts-ignore
        index: props.navigation.state.index,
        // @ts-ignore
        routes: props.navigation.state.routes,
        key: '',
      };
    }
  }, [props, isReactNavigation5]);
  const [selectedIndex] = useValues([0], []);

  //#region callbacks
  const getRouteTitle = useCallback(
    (route: Route<string>) => {
      if (isReactNavigation5) {
        const { options } = descriptors[route.key];
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
    return routes.map(route => ({
      key: route.key,
      ...getRouteTabConfigs(route),
    }));
  }, [routes, getRouteTitle, getRouteTabConfigs]);

  const handleSelectedIndexChange = (index: number) => {
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
      // @ts-ignore
      const { onTabPress } = props;
      onTabPress({ route: routes[index] });
    }
  };
  //#endregion

  //#region Effects
  /**
 * @DEV
 * here we listen to selectedIndex and call `handleSelectedIndexChange`
 */
  useCode(
    () =>
      call([selectedIndex], args => {
        handleSelectedIndexChange(args[0]);
      }),
    [selectedIndex]
  );
  /**
   * @DEV
   * here we listen to React Navigation index and update
   * selectedIndex value.
   */
  useCode(() =>
    // @ts-ignore
    set(selectedIndex, navigationIndex)
    , [navigationIndex]);

  //#endregion

  // render
  return (
    <CurvedTabBar
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
