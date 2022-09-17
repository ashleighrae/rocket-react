import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Rocket from './Rocket';
import Constants from './Constants';
import Physics from './Physics';
import Wall from './Wall';
import CorrectWord from './CorrectWord';
import IncorrectWord from './IncorrectWord';
import Translation from './Communication';

export default class PilotGameplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: true,
      score: 0,
      lives: 3,
      rightAnswer: true,
      gameOver: false,
      targetWord: "",
      correctTranslation: "",
      incorrectTranslation: "",
      worldSetup: null
    };

    this.gameEngine = null;
    this.entities = null;
  }

  componentDidMount() {
    // Setup words / database
    this.getWord();
  }

  getWord = () => {
    const db = getDatabase();
    const allWords = ["Bread", "Chicken", "Fish", "Potatoes", "Yoghurt"];
    let randomWord = allWords[Math.floor(Math.random() * allWords.length)];

    const randReference = ref(db, '/gameplay');
    update(randReference, {
      word: randomWord,
    }).then(() => {
      const reference = ref(db, '/gameplay/word');
      onValue(reference, (snapshot) => {
        this.setState({
          targetWord: snapshot.val()
        }, () => this.getCorrectTranslation(snapshot.val()));
      });
    })
      .catch((error) => {
        // The write failed...
      });

  }

  getCorrectTranslation = (word) => {
    const db = getDatabase();
    let correctRef = ref(db, '/topics/Food/' + word + '/Translation');
    onValue(correctRef, (snapshot) => {
      this.setState({
        correctTranslation: snapshot.val()
      }, () => this.getIncorrectTranslation(snapshot.val()));
    });
  }

  getIncorrectTranslation = (word) => {
    const db = getDatabase();
    const allWords = ["Bread", "Chicken", "Fish", "Potatoes", "Yoghurt"];
    let wrongRandomWord = allWords[Math.floor(Math.random() * allWords.length)];
    if (wrongRandomWord === word) {
      this.getIncorrectTranslation(word);
    } else {
      let incorrectRef = ref(db, '/topics/Food/' + wrongRandomWord + '/Translation');
      onValue(incorrectRef, (snapshot) => {
        this.setState({
          incorrectTranslation: snapshot.val()
        }, () => this.initWorld());
      });
    }
  }

  initWorld = () => {
    if (!this.state.worldSetup) {
      this.entities = this.setupWorld();
      this.setState({
        worldSetup: true
      });
    } else {
      this.gameEngine.swap(this.setupWorld());
    }
  }

  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0.0;

    let posArray = [1.2, 2, 5];

    /* Randomize posArray using Durstenfeld shuffle algorithm */
    for (var i = posArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = posArray[i];
      posArray[i] = posArray[j];
      posArray[j] = temp;
    }

    let correctWordPos = posArray.pop();
    let incorrectWordPos = posArray.pop();

    let rocket = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 6, Constants.MAX_HEIGHT / 2, 70, 50);
    let floor = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 25, Constants.MAX_WIDTH, 10, { isStatic: true });
    let ceiling = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true });
    let correctWord = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 0.7, Constants.MAX_HEIGHT / correctWordPos, 50, 50, { isStatic: true });
    let incorrectWord = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 0.7, Constants.MAX_HEIGHT / incorrectWordPos, 50, 50, { isStatic: true });

    Matter.World.add(world, [rocket, floor, ceiling, correctWord, incorrectWord]);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      var pairs = event.pairs;

      // If rocket gets correct word, it gets a point
      if (Matter.Collision.collides(rocket, correctWord) != null) {
        this.gameEngine.dispatch({ type: "score" });
        Matter.World.remove(world, [correctWord]);
        Matter.World.remove(world, [incorrectWord]);
      } else if (Matter.Collision.collides(rocket, incorrectWord) != null) {
        this.gameEngine.dispatch({ type: "life-lost" });
        Matter.World.remove(world, [correctWord]);
        Matter.World.remove(world, [incorrectWord]);
      }
    });

    Matter.Events.on(engine, 'afterUpdate', (event) => {
      // If rocket misses word, loose a life
      if (correctWord.position.x < (rocket.position.x - 100)) {
        this.gameEngine.dispatch({ type: "life-lost" });
      }
    });

    return {
      physics: { engine: engine, world: world },
      rocket: { body: rocket, renderer: Rocket },
      floor: { body: floor, size: [Constants.MAX_WIDTH, 50], color: "#352a55", renderer: Wall },
      ceiling: { body: ceiling, size: [Constants.MAX_WIDTH, 50], color: "#352a55", renderer: Wall },
      correctWord: { body: correctWord, size: [Constants.WORD_WIDTH, 50], color: "green", correctTranslation: this.state.correctTranslation, renderer: CorrectWord },
      incorrectWord: { body: incorrectWord, size: [Constants.WORD_WIDTH, 50], color: "white", incorrectTranslation: this.state.incorrectTranslation, renderer: IncorrectWord }
    }
  }

  onEvent = (e) => {
    if (e.type === "life-lost") {
      this.setState({
        lives: this.state.lives - 1,
        rightAnswer: false,
        running: false,
      }, () => Translation.SetLives(this.state.lives));


      if (this.state.lives <= 0) {
        this.setState({
          gameOver: true,
          running: false,
          score: 0,
          lives: 3,
        });
        Translation.SetLives(3);
        Translation.SetScore(0);
      }
    } else if (e.type === "score") {
      this.setState({
        score: this.state.score + 1,
        rightAnswer: true,
        running: false
      }, () => Translation.SetScore(this.state.score));
    }
  }

  reset = () => {
    this.getWord();
    this.setState({
      running: true,
      gameOver: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/img/background.png')} style={styles.backgroundImage} resizeMode="stretch" />
        {this.state.worldSetup && <GameEngine
          ref={(ref) => { this.gameEngine = ref; }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}>
        </GameEngine>}
        <Text style={styles.targetWord}>{Translation.GetWord()}</Text>
        <Text style={styles.score}>{this.state.score}</Text>
        <Text style={styles.lives}>{this.state.lives}/3</Text>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('ModeSelection');
        }} style={styles.close}>
          <Icon name={'close'} color='white' size='30' />
        </TouchableOpacity>
        {!this.state.running && this.state.gameOver && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
          <View style={styles.fullScreen}>
            <Text style={styles.gameOverText}>Game Over</Text>
          </View>
        </TouchableOpacity>}
        {!this.state.running && this.state.rightAnswer && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
          <View style={styles.fullScreen}>
            <Text style={styles.gameOverText}>Correct! {Translation.GetWord()} = {Translation.GetCorrectTranslation()}</Text>
          </View>
        </TouchableOpacity>}
        {!this.state.running && !this.state.rightAnswer && !this.state.gameOver && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
          <View style={styles.fullScreen}>
            <Text style={styles.gameOverText}>Incorrect! {Translation.GetWord()} = {Translation.GetCorrectTranslation()}</Text>
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
    fontSize: 48
  },
  gameOverSubText: {
    color: 'white',
    fontSize: 24
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
    left: '10%'
  },
  targetWord: {
    position: 'absolute',
    color: 'white',
    fontSize: 40,
    top: 50,
    left: '43%'
  },
  lives: {
    position: 'absolute',
    color: 'white',
    fontSize: 40,
    top: 60,
    left: '80%'
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },
  close: {
    backgroundColor: '#FE546F',
    position: 'absolute',
    color: 'white',
    padding: '1%',
    top: 60,
    right: '85%',
    borderRadius: '100',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

