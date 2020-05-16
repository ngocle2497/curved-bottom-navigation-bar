import React, { memo } from 'react'
import equals from 'react-fast-compare'
import Animated, { eq, interpolate } from 'react-native-reanimated'
import { withTransition } from 'react-native-redash'

interface IconDotProps {
    index: number;
    selectedIndex: Animated.Node<number>;
    children: React.ReactNode;
}

const IconDotComponent = (props: IconDotProps) => {
    const { index, selectedIndex, children } = props;
    const progress = withTransition(eq(selectedIndex, index),{duration: 200})
    const opacity = interpolate(progress, {
        inputRange: [0, 0.6, 1],
        outputRange: [0, 0, 1]
    })
    return (
        <Animated.View style={{ position: 'absolute',opacity }}>
            {children}
        </Animated.View>
    )
}

export const IconDot = memo(IconDotComponent, (prevProps, nextProps) => equals(prevProps, nextProps))
