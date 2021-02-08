/* eslint-disable no-undef */
import type Animated from 'react-native-reanimated';
export interface TabConfigsType {
  icon: (props: { progress: Animated.SharedValue<number> }) => React.ReactNode;
  renderTitle?: (props: {
    progress: Animated.SharedValue<number>;
    title: string;
  }) => React.ReactNode;
}

export interface TabsConfigsType {
  [key: string]: TabConfigsType;
}

export interface TabBarAnimationConfigurableProps {
  /**
   * Animation duration.
   * @default 500
   */
  duration?: number;
}

interface TabRoute extends TabConfigsType {
  key: string;
  title: string;
}

export interface TabBarViewProps extends TabBarAnimationConfigurableProps {
  /**
   * Selected animated index.
   */
  selectedIndex: Animated.SharedValue<number>;
  /**
   * Mapped routes with tab configs to be presented.
   */
  routes: TabRoute[];
  /**
   * TabBarColor.
   * @default #FFFFFF
   */
  tabBarColor: string;

  /**
   * @default 60
   */
  dotSize: number;
  /**
   * Dot Color.
   * @default #FFFFFF
   */
  dotColor: string;

  barHeight: number;

  titleShown: boolean;
}

export interface TabBarItemProps
  extends TabConfigsType,
    Pick<TabBarViewProps, 'titleShown'> {
  /**
   * Selected animated index.
   */
  selectedIndex: Animated.SharedValue<number>;

  index: number;

  countTab: number;

  indexAnimated: Animated.SharedValue<number>;

  width: number;

  title?: string;
}
export interface DotProps {
  /**
   * Selected animated index.
   */
  selectedIndex: Animated.SharedValue<number>;
  /**
   * Mapped routes with tab configs to be presented.
   */
  routes: TabRoute[];

  progress: Animated.SharedValue<number>;

  width: number;
  /**
   * @default 60
   */
  dotSize: number;

  dotColor: string;

  barHeight: number;
}
