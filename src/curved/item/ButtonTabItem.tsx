import React, { memo, useMemo, useCallback } from 'react'
import { View } from 'react-native'
import equals from 'react-fast-compare'
import { styles } from './style'
import { createNativeWrapper, TouchableOpacity, State } from 'react-native-gesture-handler';
import Animated, { eq, cond, interpolate, useCode, set, and, not,round, clockRunning } from 'react-native-reanimated';
import { onGestureEvent, useValues, withTimingTransition } from 'react-native-redash';
import { TabBarItemProps } from '../../types';

const AnimatedRawButton = createNativeWrapper(
    Animated.createAnimatedComponent(TouchableOpacity),
    {
        shouldCancelWhenOutside: true,
        shouldActivateOnStart: true,
    }
);
const gestureHandler = (state: Animated.Value<State>) =>
    onGestureEvent({ state });

const ButtonTabItemComponent = (props: TabBarItemProps) => {
    const { index, selectedIndex, countTab, indexAnimated, width, icon, clock } = props;
    const isActive = eq(round(indexAnimated), index)
    const progress = withTimingTransition(isActive, { duration: 200 })
    const [state] = useValues([State.UNDETERMINED], []);
    // effect
    useCode(
        () =>
            cond(and(eq(indexAnimated, selectedIndex),not(clockRunning(clock)), eq(state, State.END)), [
                set(selectedIndex, index),
                set(state, State.UNDETERMINED),
            ]),
        [state]
    );
    // style
    const containerIconStyle = [{

        opacity: interpolate(progress, {
            inputRange: [0, 1],
            outputRange: [1, 0]
        }),
        transform: [{
            translateY: interpolate(progress, {
                inputRange: [0, 1],
                outputRange: [0, 50]
            })
        }]
    }
    ]
    const buttonTab = useMemo(() => [
        styles.buttonTab,
        {
            width: width / countTab,
        }
    ], [width, countTab])

    // render
    const renderIcon = useCallback(
        () => {
            return icon({ progress: progress })
        },
        [props],
    )
    return (
        <AnimatedRawButton {...gestureHandler(state)}>
            <View style={buttonTab}>
                <Animated.View style={containerIconStyle}>
                    {renderIcon()}
                </Animated.View>
            </View>
        </AnimatedRawButton>
    )
}

const ButtonTab = memo(ButtonTabItemComponent, (prevProps, nextProps) => equals(prevProps, nextProps))
export default ButtonTab
