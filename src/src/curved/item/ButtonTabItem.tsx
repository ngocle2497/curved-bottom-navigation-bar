import React, {memo, useCallback, useMemo} from 'react'
import isEqual from 'react-fast-compare'
import {TouchableOpacity, View} from 'react-native'
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {sharedRound, sharedTiming, useInterpolate} from '../../AnimatedHelper'
import type {TabBarItemProps} from '../../types'
import {styles} from './style'

const ButtonTabItemComponent = (props: TabBarItemProps) => {
  // props
  const {
    index,
    selectedIndex,
    countTab,
    indexAnimated,
    width,
    icon,
    onPress = () => {},
    focused
  } = props
  // reanimated
  const {bottom} = useSafeAreaInsets()
  const isActive = useDerivedValue(() => sharedRound(indexAnimated.value))
  const progress = useSharedValue(0)

  const opacity = useInterpolate(progress, [0, 0.8], [1, 0])
  const translateY = useInterpolate(progress, [0, 0.4], [0, 10])

  const _onPress = useCallback(() => {
    onPress(index)
    selectedIndex.value = index
  }, [index, selectedIndex])

  // effect
  useAnimatedReaction(
    () => isActive.value === index,
    (result, prevValue) => {
      if (result !== prevValue) {
        progress.value = sharedTiming(result ? 1 : 0)
      }
    }
  )

  // reanimated style
  const containerIconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      {
        translateY: translateY.value
      }
    ]
  }))

  const buttonTab = useMemo(
    () => ({
      width: width / countTab,
      paddingBottom: bottom
    }),
    [width, countTab, bottom]
  )

  // render

  // render
  return (
    <TouchableOpacity
      style={{
        opacity: focused ? 1 : 0
      }}
      disabled={!focused}
      onPress={_onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.buttonTab, buttonTab]}>
        <Animated.View style={containerIconStyle}>{icon({progress, focused})}</Animated.View>
      </View>
    </TouchableOpacity>
  )
}

export const ButtonTab = memo(ButtonTabItemComponent, isEqual)
