import React, { memo, useMemo, useState, useEffect } from 'react'
import { View, ViewStyle, StyleProp, Dimensions } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import ButtonTabItem from './item/ButtonTabItem'
import Dot from './item/Dot';

import { TabBarViewProps } from '../types'

import { useSafeArea } from 'react-native-safe-area-context';
import Animated, { set, useCode, interpolate, eq, cond, not } from 'react-native-reanimated';
import { useValues, timing, withTimingTransition, useClocks } from 'react-native-redash'

import equals from 'react-fast-compare'

import { styles } from './style'
import { HEIGHT_HOLE } from './constant';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);


const CurvedTabBarComponent = (props: TabBarViewProps) => {
    // props
    const { routes,
        selectedIndex,
        dotSize: SIZE_DOT,
        barHeight: TAB_BAR_HEIGHT,
        duration,
        dotColor,
        tabBarColor } = props;

    const [width, setWidth] = useState(Dimensions.get('window').width)
    const safeArea = useSafeArea()
    const [clock] = useClocks(1, [])
    const widthTab = useMemo(() => width / routes.length, [routes, width])

    // animated
    const [indexAnimated] = useValues([0], [])
    const progress = withTimingTransition(eq(indexAnimated, selectedIndex), { duration: 150, })

    // path
    const d = useMemo(() =>
        `M0,0 L${width + widthTab / 2 - SIZE_DOT},0
    C${width + widthTab / 2 - SIZE_DOT * 0.5},0 ${width + widthTab / 2 - SIZE_DOT * 0.75},${HEIGHT_HOLE} ${width + widthTab / 2},${HEIGHT_HOLE} 
    C${width + widthTab / 2 + SIZE_DOT * 0.75},${HEIGHT_HOLE} ${width + widthTab / 2 + SIZE_DOT * 0.5},0 ${width + widthTab / 2 + SIZE_DOT} 0 
    L${width * 2},0 L ${width * 2},${TAB_BAR_HEIGHT} L 0,${TAB_BAR_HEIGHT} Z
    `, [width, SIZE_DOT, TAB_BAR_HEIGHT, routes, safeArea])

    // style
    const containerStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            styles.container,
            {
                height: TAB_BAR_HEIGHT,
                bottom: safeArea.bottom,
            },
        ],
        [safeArea]
    );
    const svgStyle = [
        styles.svg, {
            top: 0,
            height: TAB_BAR_HEIGHT,
            transform: [{
                translateX: interpolate(indexAnimated, {
                    inputRange: routes.map((item: any, index: number) => index),
                    outputRange: routes.map((item: any, index: number) => -((index + 1) * width / routes.length)).reverse()
                })
            }]
        }
    ]
    const rowTab = useMemo(() => [
        styles.rowTab,
        { bottom: safeArea.bottom, width: width, height: TAB_BAR_HEIGHT }
    ], [safeArea, TAB_BAR_HEIGHT, width])

    const bottomView = useMemo(() => [
        styles.bottomView,
        {
            height: safeArea.bottom,
            width: width,
            backgroundColor: tabBarColor,
        }],
        [safeArea, width, tabBarColor])

    // effect
    useCode(() => cond(not(eq(indexAnimated, selectedIndex)), set(indexAnimated, timing({ to: selectedIndex, clock: clock, from: indexAnimated, duration: duration }))), [selectedIndex])
    useEffect(() => {
        const handler = () => {
            setWidth(Dimensions.get('window').width)
        }
        Dimensions.addEventListener('change', handler)
        return () => {
            Dimensions.removeEventListener('change', handler)
        }
    }, [])
    return (
        <>
            <View style={containerStyle}>
                <AnimatedSvg width={width * 2} height={TAB_BAR_HEIGHT} style={svgStyle}>
                    <Path d={`${d}`} fill={tabBarColor} stroke={'transparent'} strokeWidth={1} />
                </AnimatedSvg>
            </View>
            <View style={rowTab} >
                <Dot dotColor={dotColor} dotSize={SIZE_DOT} barHeight={TAB_BAR_HEIGHT} width={width} selectedIndex={indexAnimated} routes={routes} progress={progress} />
                {routes.map(({ key, ...configs }, index) => {
                    return <ButtonTabItem
                        width={width}
                        key={key}
                        clock={clock}
                        indexAnimated={indexAnimated}
                        countTab={routes.length}
                        selectedIndex={selectedIndex}
                        index={index} {...configs} />
                }
                )}
            </View>
            <View style={bottomView} />
        </>
    )
}

const CurvedTabBar = memo(CurvedTabBarComponent, (prevProps, nextProps) => equals(prevProps, nextProps))

export default CurvedTabBar

