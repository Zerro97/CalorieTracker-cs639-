import React from 'react';
import { createAppContainer, createSwitchNavigator  } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import HomeScreen from './pages/HomeScreen';
import LogInScreen from './pages/LogInScreen';
import SignUpScreen from './pages/SignUpScreen';

import MealScreen from './pages/MealScreen';
import MealCreateScreen from './pages/MealCreateScreen';
import MealEditScreen from './pages/MealEditScreen';

import FoodScreen from './pages/FoodScreen';
import FoodCreateScreen from './pages/FoodCreateScreen';
import FoodEditScreen from './pages/FoodEditScreen';

import ActivityScreen from './pages/ActivityScreen';
import ActivityCreateScreen from './pages/ActivityCreateScreen';
import ActivityEditScreen from './pages/ActivityEditScreen';

import ProfileScreen from './pages/ProfileScreen';
import ProfileEditScreen from './pages/ProfileEditScreen';

/**
 *  Drawer Navigator: Home -> LogIn, SignUp (LandNavigator)
 *  Tab Navigator: LogIn <-> SignUp (AuthNavigator)
 * 
 *  Stack Navigator: LogIn -> Meals (LogInNavigator)
 *  Stack Navigator: SignUp -> Meals (SignUpNavigator)
 *    
 *  Tab Navigator: Meals <-> Activities (TabNavigator)
 */

export default class App extends React.Component {
  render(){
    return (
      <LandingNavigator></LandingNavigator>
    );
  }
}

const ProfileEditNavigator = createStackNavigator(
  {
    Profile: ProfileScreen,
    ProfileEdit: ProfileEditScreen,
  },
  {
    headerMode: 'none',
  }
);

const ActivityCreateNavigator = createStackNavigator(
  {
    Activity: ActivityScreen,
    ActivityCreate: ActivityCreateScreen,
    ActivityEdit: ActivityEditScreen,
  },
  {
    headerMode: 'none',
  }
);

const MealCreateNavigator = createStackNavigator(
  {
    Meal: MealScreen,
    MealCreate: MealCreateScreen,
    MealEdit: MealEditScreen,

    Food: FoodScreen,
    FoodCreate: FoodCreateScreen,
    FoodEdit: FoodEditScreen,
  },
  {
    headerMode: 'none',
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
      },
    },
    Profile: {
      screen: ProfileEditNavigator,
      navigationOptions: {
        tabBarLabel: 'Profile',
      },
    },
    Meals: {
      screen: MealCreateNavigator,
      navigationOptions: {
        tabBarLabel: 'Meals',
      },
    },
    Activity: {
      screen: ActivityCreateNavigator,
      navigationOptions: {
        tabBarLabel: 'Activity',
      },
    },
  },
  {
    /*navigationOptions: () => ({
      tabBarIcon: () => {
        return <Icon type="font-awesome" name="trash"/>
      },
    }),*/
    tabBarOptions: {
      tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      },
      labelStyle: {
        fontSize: 20,
      },
      activeTintColor: "#af4448",
      inactiveTintColor: "grey",
    }
  }
);

let AuthNavigator = createSwitchNavigator(
  {
    LogIn: LogInScreen,
    SignUp: SignUpScreen,
    Home: TabNavigator,
  },
  {
    headerMode: 'none',
    gesturesEnabled: false,
  }
);
const LandingNavigator = createAppContainer(AuthNavigator);