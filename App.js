import React, { Component } from 'react';
import PilotGameplay from './game/PilotMode';
import GroundControl from './game/GroundControlMode';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from './Home';
import Communication from './game/Communication';


export default class App extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home
  },
  PilotMode: {
    screen: PilotGameplay,
    navigationOptions: {
      headerShown: false,
    }
  },
  GroundControlMode: {
    screen: GroundControl,
    navigationOptions: {
      headerShown: false,
    }
  }
}, {
  initialRouteName: "Home"
});

const AppContainer = createAppContainer(AppNavigator);