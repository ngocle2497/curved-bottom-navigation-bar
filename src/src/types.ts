/* eslint-disable no-undef */
import React from 'react'
import type Animated from 'react-native-reanimated'

export interface TabIconProps {
  progress: Animated.SharedValue<number>
  focused: boolean
}
export interface TabTitleProps {
  progress: Animated.SharedValue<number>
  title: string
  focused: boolean
}
export interface TabConfigsType {
  icon: (props: TabIconProps) => React.ReactNode
}

export type TabsConfigsType = Record<string, TabConfigsType>

export interface TabType {
  key: string
  title: string
  icon: (progress: boolean, focused: boolean) => JSX.Element
}

export interface TabRoute extends TabConfigsType {
  key: string
  title: string
}

export interface TabBarViewProps {
  /**
   * Selected animated index.
   */
  selectedIndex: Animated.SharedValue<number>
  /**
   * Mapped routes with tab configs to be presented.
   */
  routes: TabType[]
  /**
   * TabBarColor.
   * @default #FFFFFF
   */
  tabBarColor: string

  /**
   * @default 60
   */
  dotSize: number
  /**
   * Dot Color.
   * @default #FFFFFF
   */
  dotColor: string

  navigationIndex: number

  barHeight: number

  barWidth?: number

  isRtl: boolean
  /**
   * Animation duration.
   * @default 500
   */
  duration?: number

  onPress?: (index: number) => void

  children?: React.ReactNode
}

export interface TabBarItemProps extends TabConfigsType {
  /**
   * Selected animated index.
   */
  selectedIndex: Animated.SharedValue<number>

  index: number

  countTab: number

  indexAnimated: Animated.SharedValue<number>

  width: number

  title?: string

  focused: boolean

  onPress?: (index: number) => void
}
export interface DotProps {
  /**
   * Selected animated index.
   */
  selectedIndex: Animated.SharedValue<number>
  /**
   * Mapped routes with tab configs to be presented.
   */
  routes: TabRoute[]

  progress: Animated.SharedValue<number>

  width: number
  /**
   * @default 60
   */
  dotSize: number

  dotColor: string

  barHeight: number

  isRtl: boolean

  navigationIndex: number
}
