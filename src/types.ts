import Animated from 'react-native-reanimated';
export interface TabConfigsType {
    icon:
    ((props: {
        progress: Animated.Node<number>;
    }) => React.ReactNode)
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
}

export interface TabBarViewProps
    extends TabBarAnimationConfigurableProps {
    /**
     * Selected animated index.
     */
    selectedIndex: Animated.Value<number>;
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

}

export interface TabBarItemProps extends TabConfigsType {
    /**
     * Selected animated index.
     */
    selectedIndex: Animated.Value<number>;

    index: number;

    countTab: number;

    indexAnimated: Animated.Node<number>;

    clock:Animated.Clock;

    width: number;
}
export interface DotProps {
    /**
 * Selected animated index.
 */
    selectedIndex: Animated.Value<number>;
    /**
 * Mapped routes with tab configs to be presented.
 */
    routes: TabRoute[];

    progress: Animated.Node<number>;

    width: number;
    /**
     * @default 60
     */
    dotSize: number;

    dotColor: string;

    barHeight: number;
}