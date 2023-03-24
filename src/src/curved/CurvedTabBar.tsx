/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {memo, useCallback, useMemo} from 'react'
import isEqual from 'react-fast-compare'
import {StyleProp, View, ViewStyle} from 'react-native'
import Animated, {useAnimatedProps, useDerivedValue} from 'react-native-reanimated'
import {useSafeAreaFrame, useSafeAreaInsets} from 'react-native-safe-area-context'
import Svg, {Path, PathProps} from 'react-native-svg'
import {scale, verticalScale, widthPx} from '../../../Responsive'

import {sharedEq, sharedTiming, useInterpolate, withSharedTransition} from '../AnimatedHelper'
import {RNShadow} from '../RNShadow'
import type {TabBarViewProps, TabRoute} from '../types'
import {HEIGHT_HOLE, TAB_BAR_HEIGHT} from './constant'
import {ButtonTab} from './item/ButtonTabItem'
import {Dot} from './item/Dot'
import {styles} from './style'

const AnimatedPath = Animated.createAnimatedComponent(Path)

const CurvedTabBarComponent = (props: TabBarViewProps) => {
  // props
  const {
    routes,
    selectedIndex,
    barWidth,
    duration,
    dotColor,
    tabBarColor,
    isRtl,
    navigationIndex,
    dotSize: SIZE_DOT,
    barHeight = TAB_BAR_HEIGHT,
    onPress = () => {},
    children
  } = props
  // state
  const {bottom} = useSafeAreaInsets()
  const {width} = useSafeAreaFrame()
  const actualBarWidth = useMemo<number>(() => barWidth ?? width, [barWidth, width])
  const widthTab = useMemo(() => actualBarWidth / routes.length, [routes, actualBarWidth])
  const inputRange = useMemo(
    () =>
      isRtl
        ? routes.map((_: any, index: number) => index).reverse()
        : routes.map((_: any, index: number) => index),
    [isRtl, routes]
  )

  const outputRange = useMemo(
    () => routes.map((_: any, index: number) => (index / routes.length) * actualBarWidth),
    [routes, actualBarWidth]
  )
  const actualBarHeight = useMemo<number>(() => barHeight + bottom, [barHeight, bottom])
  const indexAnimated = useDerivedValue(() => sharedTiming(selectedIndex.value, {duration}))

  // func
  const renderButtonTab = useCallback(
    ({key, ...configs}: TabRoute, index: number) => {
      return (
        <ButtonTab
          focused={index === navigationIndex}
          width={actualBarWidth}
          key={key}
          onPress={onPress}
          indexAnimated={indexAnimated}
          countTab={routes.length}
          selectedIndex={selectedIndex}
          index={index}
          {...configs}
        />
      )
    },
    [indexAnimated, routes.length, selectedIndex, actualBarWidth, navigationIndex]
  )

  // reanimated

  const progress = withSharedTransition(sharedEq(selectedIndex, indexAnimated))

  const xPath = useInterpolate(indexAnimated, inputRange, outputRange)

  // path
  const pathProps = useAnimatedProps<PathProps>(() => {
    const centerHoleX = xPath.value + widthTab / 2
    return {
      d: `M0,0 L${centerHoleX - SIZE_DOT},0
      C${centerHoleX - SIZE_DOT * 0.5},0 ${
        centerHoleX - SIZE_DOT * 0.75
      },${HEIGHT_HOLE} ${centerHoleX},${HEIGHT_HOLE} 
      C${centerHoleX + SIZE_DOT * 0.75},${HEIGHT_HOLE} ${centerHoleX + SIZE_DOT * 0.5},0 ${
        centerHoleX + SIZE_DOT
      } 0 
      L${actualBarWidth * 2},0 L ${actualBarWidth * 2},${actualBarHeight} L 0,${actualBarHeight} Z
      `
    }
  }, [actualBarWidth, widthTab, SIZE_DOT, actualBarHeight])

  // style
  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        height: actualBarHeight,
        width: actualBarWidth
      }
    ],
    [actualBarHeight, actualBarWidth]
  )
  const rowTab = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        width: actualBarWidth,
        height: actualBarHeight
      }
    ],
    [actualBarHeight, actualBarWidth]
  )

  const renderDotView = useMemo(() => {
    return (
      <View style={[styles.rowTab, rowTab]}>
        <Dot
          navigationIndex={navigationIndex}
          isRtl={isRtl}
          dotColor={dotColor}
          dotSize={SIZE_DOT}
          barHeight={actualBarHeight}
          width={actualBarWidth}
          selectedIndex={indexAnimated}
          routes={routes}
          progress={progress}
        />
        <View
          style={{
            flex: 1,
            position: 'absolute',
            alignSelf: 'flex-end',
            width: widthPx(60),
            zIndex: 1000,
            marginLeft: navigationIndex === 0 ? widthTab : scale(10),
            marginRight: navigationIndex === 2 ? widthTab : 0,
            top: 0,
            height: verticalScale(40)
          }}
        >
          {children}
        </View>

        {routes.map(renderButtonTab)}
      </View>
    )
  }, [
    navigationIndex,
    widthTab,
    progress,
    routes,
    indexAnimated,
    rowTab,
    actualBarWidth,
    isRtl,
    actualBarHeight,
    SIZE_DOT,
    dotColor,
    children
  ])

  return (
    <>
      <RNShadow style={[styles.container, containerStyle]}>
        <Svg width={actualBarWidth} height={actualBarHeight} style={styles.svg}>
          <AnimatedPath
            animatedProps={pathProps}
            translateY={3}
            fill={tabBarColor}
            stroke={'transparent'}
            strokeWidth={0}
          />
        </Svg>
      </RNShadow>
      {renderDotView}
    </>
  )
}

export const CurvedTabBar = memo(CurvedTabBarComponent, isEqual)
