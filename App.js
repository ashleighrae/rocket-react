import React, { Component } from 'react';
import PilotGameplay from './pilot_mode/PilotGameplay';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from './Home';


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
    screen: PilotGameplay
  }
},{
  initialRouteName: "Home"
});

const AppContainer = createAppContainer(AppNavigator);