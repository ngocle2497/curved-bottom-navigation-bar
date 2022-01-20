import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

import {Home} from './Home';
import {Profile} from './Profile';
import AnimatedTabBar, {TabsConfigsType} from 'curved-bottom-navigation-bar';
import {Likes} from './Likes';
import {Create} from './Create';
Icon.loadFont().then();
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const CustomIcon = ({progress}: {progress: Animated.SharedValue<number>}) => {
  const color = useDerivedValue(() =>
    interpolateColor(progress.value, [0, 1], ['red', 'green']),
  );
  return <AnimatedIcon name={'home'} size={24} color={color.value} />;
};

const CustomTitle = ({
  progress,
  title,
}: {
  progress: Animated.SharedValue<number>;
  title: string;
}) => {
  const fontSize = useDerivedValue(() =>
    interpolate(progress.value, [0, 1], [14, 1]),
  );
  const style = useAnimatedStyle(() => ({
    fontSize: fontSize.value,
  }));
  return <Animated.Text style={[style]}>{title}</Animated.Text>;
};

const tabs: TabsConfigsType = {
  Home: {
    icon: props => <AnimatedIcon name={'home'} size={24} />,
  },
  Profile: {
    icon: props => <Icon name={'user'} size={24} />,
  },
  Create: {
    icon: props => <Icon name={'plus'} size={24} />,
  },
  Likes: {
    icon: props => <Icon name={'like2'} size={24} />,
  },
};
const Tab = createBottomTabNavigator();

const AppComponent = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          tabBar={props => (
            <AnimatedTabBar tabs={tabs} titleShown {...props} />
          )}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Likes" component={Likes} />
          <Tab.Screen name="Create" component={Create} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export const App = memo(AppComponent, isEqual);
