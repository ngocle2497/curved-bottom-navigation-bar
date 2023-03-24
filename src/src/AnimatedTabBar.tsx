import React, {memo, useEffect} from 'react'
import isEqual from 'react-fast-compare'
import {I18nManager} from 'react-native'
import Animated, {useAnimatedReaction, useSharedValue} from 'react-native-reanimated'

import {
  DEFAULT_ITEM_ANIMATION_DURATION,
  SIZE_DOT,
  TAB_BAR_COLOR,
  TAB_BAR_HEIGHT
} from './curved/constant'
import {CurvedTabBar} from './curved/CurvedTabBar'
import type {TabType} from './types'

Animated.addWhitelistedNativeProps({
  width: true,
  stroke: true,
  backgroundColor: true
})

interface AnimatedTabBarProps {
  /**
   * Tabs configurations.
   */
  tabs: TabType[]

  /**
   * Overwrite background color of tabbar
   */
  barColor?: string

  /**
   * Overwrite radius of dot
   */
  dotSize?: number

  /**
   * Overwrite height of tabbar
   */
  barHeight?: number
  /**
   * Overwrite width of tabbar
   */
  barWidth?: number

  /**
   * Custom dot color
   */
  dotColor?: string

  /**
   * Show title or not
   * @default false
   */

  /**
   * initial index
   * @default 0
   */
  navigationIndex?: number

  /**
   * duration
   */
  duration?: number

  onPress?: (index: number) => void

  children?: React.ReactNode
}
const AnimatedTabBarComponent = (props: AnimatedTabBarProps) => {
  // props
  const {
    tabs,
    duration = DEFAULT_ITEM_ANIMATION_DURATION,
    barColor = TAB_BAR_COLOR,
    dotSize = SIZE_DOT,
    barHeight = TAB_BAR_HEIGHT,
    dotColor = TAB_BAR_COLOR,
    onPress = () => {},
    barWidth,
    navigationIndex = 0,
    children
  } = props

  const selectedIndex = useSharedValue(0)

  useEffect(() => {
    selectedIndex.value = navigationIndex
  }, [navigationIndex])

  useAnimatedReaction(
    () => selectedIndex.value,
    () => {},
    [selectedIndex]
  )

  // render
  return (
    <CurvedTabBar
      isRtl={I18nManager.isRTL}
      barWidth={barWidth}
      dotColor={dotColor}
      barHeight={barHeight}
      dotSize={dotSize}
      tabBarColor={barColor}
      selectedIndex={selectedIndex}
      navigationIndex={navigationIndex}
      routes={tabs}
      children={children}
      onPress={onPress}
      duration={duration}
    />
  )
}
export const AnimatedTabBar = memo(AnimatedTabBarComponent, isEqual)
