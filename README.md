<div align="center">
<h1>Curved Navigation Bar</h1>


<img src="./preview.gif">

Hight performance animated bottom navigation bar for both Android and IOS 😎 with react navigation v4/v5.

</div>

---

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Props](#props)
4. [Credits](#built-with)
5. [License](#license)

## Installation

```sh
yarn add curved-bottom-navigation-bar
# or
npm install curved-bottom-navigation-bar
```

> Also, you need to install [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated), [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler) & [react-native-svg](https://github.com/react-native-community/react-native-svg), and follow theirs installation instructions.

## Usage

<details>
  <summary>React Navigation v5</summary>

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimatedTabBar, {TabsConfigsType} from 'curved-bottom-navigation-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
const tabs: TabsConfigsType = {
    Home: {
        icon: ({ progress }) => /* ICON COMPONENT */
    },
    Profile: {
        icon: ({ progress }) => /* ICON COMPONENT */
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
```

</details>

<details>
  <summary>React Navigation v4</summary>

```tsx
import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AnimatedTabBar, {TabsConfigsType} from 'curved-bottom-navigation-bar';

const tabs: TabsConfigsType = {
    Home: {
        icon: ({ progress }) => /* ICON COMPONENT */
    },
    Profile: {
        icon: ({ progress }) => /* ICON COMPONENT */
    },
}

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
  {
    tabBarComponent: props => <AnimatedTabBar tabs={tabs} {...props} />,
  },
);

const AppContainer = createAppContainer(TabNavigator);

export default () => (
  <SafeAreaProvider>
    <AppContainer />
  </SafeAreaProvider>
);
```

</details>

### Animated Icon

In order to animate the tab icon color, you will need to use the provded prop `color` that will be provided to the icon.

This example below should explain it better:

```tsx
import React from 'react';
import Animated from 'react-native-reanimated';


interface AnimatedIconProps {
  progress: Animated.Node<number>; // Reanimated - 0 is not Active, 1 is Active
}

const AnimatedIcon = ({ progress }: AnimatedIconProps) => {
  return (
   /* DO SOME THING */
  );
};

export default AnimatedIcon;
```

## Props

| name           | required | default                          | description                                                                 |
| -------------- | -------- | -------------------------------- | --------------------------------------------------------------------------- |
| duration       | NO       | 500                              | Duration for the tabs animation.                                            |
| barColor         | NO       | #FFFFFF           | background color of bottom bar.              |
| tabs           | YES      |                                  | A dictionary for all tabs configurations, check `TabConfigsType` interface. |
| dotSize          | NO       | 60     | Size of dot.                        |
| dotColor | NO       | #FFFFFF | Color of dot.                                        |

### TabConfigsType

| name            | required | default | description                                                                        |
| --------------- | -------- | ------- | ---------------------------------------------------------------------------------- |
| icon            | YES      |         |  Component to be render as tab icon, it will recevie an animated node prop `progress`.


## Built With

- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)
- [react-native-redash](https://github.com/wcandillon/react-native-redash)
- [react-native-svg](https://github.com/react-native-community/react-native-svg)
- [react-navigation](https://github.com/react-navigation/react-navigation)

## License

MIT

---
</p>
