import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import AnimatedTabBar, {TabsConfigsType} from 'curved-bottom-navigation-bar';
import React from 'react';
import {Image, useWindowDimensions, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const HomeScreen = () => <View style={{flex: 1, backgroundColor: 'green'}} />;

const SettingsScreen = () => (
  <View style={{flex: 1, backgroundColor: 'violet'}} />
);

const ProfileScreen = () => <View style={{flex: 1, backgroundColor: 'pink'}} />;

const NotificationScreen = () => (
  <View style={{flex: 1, backgroundColor: 'red'}} />
);

const tabs: TabsConfigsType = {
  Home: {
    icon: ({progress, focused}) => (
      <Image
        style={{tintColor: focused ? 'red' : 'green'}}
        source={require('./assets/icon/movie-reel.png')}
      />
    ),
  },
  NotificationScreen: {
    icon: ({progress}) => (
      <Image
        style={{tintColor: 'red'}}
        source={require('./assets/icon/alarm.png')}
      />
    ),
  },
  Settings: {
    icon: ({progress}) => (
      <Image
        style={{tintColor: 'red'}}
        source={require('./assets/icon/event-ticket.png')}
      />
    ),
  },
  ProfileScreen: {
    icon: ({progress}) => (
      <Image
        style={{tintColor: 'red'}}
        source={require('./assets/icon/single-03.png')}
      />
    ),
  },
};
export function MyTabs() {
  const {width} = useWindowDimensions();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          tabBar={props => (
            <AnimatedTabBar
              tabs={tabs}
              {...props}
              titleShown={true}
              barWidth={width - 32}
            />
          )}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen
            name="NotificationScreen"
            component={NotificationScreen}
          />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
