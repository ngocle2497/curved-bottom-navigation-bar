/* eslint-disable react-hooks/rules-of-hooks */
import Animated, {
  AnimationCallback,
  Easing,
  interpolate,
  useDerivedValue,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

export const useSharedTransition = (
  state: boolean,
  config: WithTimingConfig = {
    duration: 500,
    easing: Easing.bezier(0.33, 0.01, 0, 1),
  },
): Animated.SharedValue<number> => {
  'worklet';
  return useDerivedValue(() =>
    state ? withTiming(1, config) : withTiming(0, config),
  );
};
export const withSharedTransition = (
  value: Animated.SharedValue<boolean>,
  config: WithTimingConfig = {
    duration: 500,
    easing: Easing.bezier(0, 0.55, 0.45, 1),
  },
): Animated.SharedValue<number> => {
  'worklet';
  return useDerivedValue(() =>
    value.value ? withTiming(1, config) : withTiming(0, config),
  );
};
export const sharedTiming = (
  toValue: number,
  config?: WithTimingConfig,
  callBack?: AnimationCallback,
) => {
  'worklet';
  return withTiming(
    toValue,
    Object.assign(
      {
        duration: 500,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      },
      config,
    ),
    callBack,
  );
};
export const useInterpolate = (
  progress: Animated.SharedValue<number>,
  input: number[],
  output: number[],
  type?: Animated.Extrapolate,
) => useDerivedValue(() => interpolate(progress.value, input, output, type));
export const sharedRound = (value: number) => {
  'worklet';
  return Math.round(value);
};
export const sharedEq = (
  v1: Animated.SharedValue<number | string>,
  v2: Animated.SharedValue<number | string>,
) => {
  'worklet';
  return useDerivedValue(() => v1.value === v2.value);
};
