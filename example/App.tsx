import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/Home'
import ProfileScreen from './src/Profile'
import AnimatedTabBar, { TabsConfigsType } from 'curved-bottom-navigation-bar'
import Icon from 'react-native-vector-icons/AntDesign'
const tabs: TabsConfigsType = {
  Home: {
    icon: ({ progress }) => <Icon name={'home'} size={24}/>
    },
  Profile: {
    icon: ({ progress }) => <Icon name={'user'} size={24}/>
    },
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          tabBar={props => (
            <AnimatedTabBar tabs={tabs} {...props} />
          )}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
