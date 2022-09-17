import React, { Component } from 'react';
import PilotGameplay from './game/PilotMode';
import GroundControl from './game/GroundControlMode';
import ModeSelection from './ModeSelection';
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
    screen: Home,
    navigationOptions: {
      headerShown: false,
    }
  },
  ModeSelection: {
    screen: ModeSelection,    
    navigationOptions: {
      title: '',
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      
    }
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