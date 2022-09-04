import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Rocket from './pilot_mode/Rocket';
import Constants from './pilot_mode/Constants';
import Physics from './pilot_mode/Physics';
import Wall from './pilot_mode/Wall';
import CorrectWord from './pilot_mode/CorrectWord';
import IncorrectWord from './pilot_mode/IncorrectWord';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: true,
      score: 0,
      lives: 3
    };

    this.gameEngine = null;

    this.entities = this.setupWorld();
  }


  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0.0;

    let rocket = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 6, Constants.MAX_HEIGHT / 2, 50, 50);
    let floor = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 25, Constants.MAX_WIDTH, 50, { isStatic: true });
    let ceiling = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true });
    let correctWord = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 1.2, Constants.MAX_HEIGHT / 3, 50, 50, { isStatic: true });
    let incorrectWord = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 1.2, Constants.MAX_HEIGHT / 1.2, 50, 50, { isStatic: true });

    Matter.World.add(world, [rocket, floor, ceiling, correctWord, incorrectWord]);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      var pairs = event.pairs;

      // If rocket gets correct word, it gets a point
      if (Matter.Collision.collides(rocket, correctWord) != null) {
        this.gameEngine.dispatch({ type: "score" });
      }
    });

    return {
      physics: { engine: engine, world: world },
      rocket: { body: rocket, renderer: Rocket },
      floor: { body: floor, size: [Constants.MAX_WIDTH, 50], color: "black", renderer: Wall },
      ceiling: { body: ceiling, size: [Constants.MAX_WIDTH, 50], color: "black", renderer: Wall },
      correctWord: { body: correctWord, size: [Constants.WORD_WIDTH, 50], color: "white", renderer: CorrectWord },
      incorrectWord: { body: incorrectWord, size: [Constants.WORD_WIDTH, 50], color: "white", renderer: IncorrectWord }
    }
  }

  onEvent = (e) => {
    if (e.type === "game-over") {
      //Alert.alert("Game Over");
      this.setState({
        running: false
      });
    } else if (e.type === "score") {
      this.setState({
        score: this.state.score + 1
      })
    }
  }

  reset = () => {
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <GameEngine
          ref={(ref) => { this.gameEngine = ref; }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}>
        </GameEngine>
        <Text style={styles.score}>{this.state.score}</Text>
        <Text style={styles.lives}>{this.state.lives}/3</Text>
        {!this.state.running && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
          <View style={styles.fullScreen}>
            <Text style={styles.gameOverText}>Game Over</Text>
          </View>
        </TouchableOpacity>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gameOverText: {
    color: 'white',
    fontSize: 48,
    fontFamily: 'Arial'
  },
  gameOverSubText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Arial'
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  score: {
    position: 'absolute',
    color: 'white',
    fontSize: 40,
    top: 50,
    left: '10%',
    textShadowColor: '#444444',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    fontFamily: 'Arial'
  },
  lives: {
    position: 'absolute',
    color: 'white',
    fontSize: 40,
    top: 60,
    left: '80%',
    textShadowColor: '#444444',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    fontFamily: 'Arial'
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  }
});