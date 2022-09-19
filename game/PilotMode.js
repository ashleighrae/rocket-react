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
import Word from './Word';
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
      worldSetup: null,
      wordList: [],
      roundOver: false,
      modalOpen: false,
      rocketHeight: null
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
    const dbRef = ref(db, '/topics/Food');
    let listWords = [];
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        listWords.push(childKey);
      }, this.setState({
        wordList: listWords
      }));
      this.getWordRef();
    },
      {
        onlyOnce: true
      });
  }

  getWordRef = () => {
    const db = getDatabase();
    const randomWord = this.state.wordList[Math.floor(Math.random() * this.state.wordList.length)];
    const randReference = ref(db, '/gameplay');
    update(randReference, {
      word: randomWord,
    })
      .then(() => {
        this.setState({
          targetWord: randomWord
        }, () => this.getCorrectTranslation(randomWord));
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
      }, () => this.getIncorrectTranslation(word));
    });
  }

  getIncorrectTranslation = (word) => {
    const db = getDatabase();
    let wrongRandomWord = this.state.wordList[Math.floor(Math.random() * this.state.wordList.length)];
    if (wrongRandomWord == word) {
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
      this.setState({
        running: true,
        gameOver: false,
        roundOver: false,
        modalOpen: false
      }, () => this.gameEngine.swap(this.setupWorld()));
    }
  }

  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0.0;

    let posArray = [1.2, 2.4, 5];

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
    if (this.state.rocketHeight) {
      rocket = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 6, this.state.rocketHeight, 70, 50);
    }
    let floor = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 25, Constants.MAX_WIDTH, 10, { isStatic: true });
    let ceiling = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true });
    let correctWord = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 0.7, Constants.MAX_HEIGHT / correctWordPos, 50, 50, { isStatic: true, isSensor: true });
    let incorrectWord = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 0.7, Constants.MAX_HEIGHT / incorrectWordPos, 50, 50, { isStatic: true, isSensor: true });

    Matter.World.add(world, [rocket, floor, ceiling, correctWord, incorrectWord]);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      var pairs = event.pairs;

      // If rocket gets correct word, it gets a point
      if (Matter.Collision.collides(rocket, correctWord) != null && !this.state.roundOver) {
        Matter.World.remove(world, [correctWord]);
        Matter.World.remove(world, [incorrectWord]);
        this.setState({
          roundOver: true,
          rocketHeight: rocket.position.y
        }, () => this.gameEngine.dispatch({ type: "score" }));
      } else if (Matter.Collision.collides(rocket, incorrectWord) != null && !this.state.roundOver) {
        Matter.World.remove(world, [correctWord]);
        Matter.World.remove(world, [incorrectWord]);
        this.setState({
          roundOver: true,
          rocketHeight: rocket.position.y
        }, () => this.gameEngine.dispatch({ type: "life-lost" }));
      }
    });

    Matter.Events.on(engine, 'afterUpdate', (event) => {
      // If rocket misses word, loose a life
      if (correctWord.position.x < (rocket.position.x - 100) && !this.state.roundOver) {
        Matter.World.remove(world, [correctWord]);
        Matter.World.remove(world, [incorrectWord]);
        this.setState({
          roundOver: true,
          rocketHeight: rocket.position.y
        }, () => this.gameEngine.dispatch({ type: "life-lost" }));
      }
    });

    const galaxyList = [require("../assets/img/galaxyOne.png"), require("../assets/img/galaxyThree.png")];

    return {
      physics: { engine: engine, world: world },
      floor: { body: floor, size: [Constants.MAX_WIDTH, 50], color: "#352a55", renderer: Wall },
      ceiling: { body: ceiling, size: [Constants.MAX_WIDTH, 50], color: "#352a55", renderer: Wall },
      correctWord: { body: correctWord, size: [Constants.WORD_WIDTH, 50], translation: this.state.correctTranslation, ranGalaxy: galaxyList[Math.floor(Math.random() * galaxyList.length)], renderer: Word },
      incorrectWord: { body: incorrectWord, size: [Constants.WORD_WIDTH, 50], translation: this.state.incorrectTranslation, ranGalaxy: galaxyList[Math.floor(Math.random() * galaxyList.length)], renderer: Word },
      rocket: { body: rocket, renderer: Rocket }
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
          rocketHeight: null
        });
        Translation.SetLives(3);
        Translation.SetScore(0);
      } else {
        this.handleOpen();
      }
    } else if (e.type === "score") {
      this.setState({
        score: this.state.score + 1,
        rightAnswer: true,
        running: false
      }, () => Translation.SetScore(this.state.score));
      this.handleOpen();
    }
  }

  handleOpen = () => {
    this.setState({
      modalOpen: true
    }, () => this.getWord());
  };

  render() {

    var lives = [];

    for (let i = 0; i < this.state.lives; i++) {

      lives.push(
        <Image source={require('../assets/img/heart.png')} style={styles.heart} resizeMode="stretch" key={"heart" + i}/>
      )
    }

    return (
      <View style={styles.container}>
        <Image source={require('../assets/img/background.gif')} style={styles.backgroundImage} />
        {this.state.worldSetup && <GameEngine
          ref={(ref) => { this.gameEngine = ref; }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}>
        </GameEngine>}
        <Text style={styles.score}>Score: {this.state.score}</Text>
        <View style={styles.lives}>
          {lives}
        </View>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('ModeSelection');
          Translation.PilotStatus(false);
        }} style={styles.close}>
          <Icon name={'close'} color='white' size='30' />
        </TouchableOpacity>
        {!this.state.running && this.state.gameOver && <TouchableOpacity style={styles.fullScreenButton} onPress={() => { this.getWord() }}>
          <View style={styles.fullScreen}>
            <View style={styles.popup}>
              <Text style={styles.gameover}>GAME OVER</Text>
              <Text style={styles.gameoverText}>Press here to start a new game</Text>
            </View>
          </View>
        </TouchableOpacity>}
        {this.state.modalOpen && !this.state.running && this.state.rightAnswer && <View style={styles.fullScreenButton}>
          <View style={styles.fullScreen}>
            <View style={styles.popup}>
              <Text style={styles.correct}>CORRECT</Text>
            </View>
          </View>
        </View>}
        {this.state.modalOpen && !this.state.running && !this.state.rightAnswer && !this.state.gameOver && <View style={styles.fullScreenButton}>
          <View style={styles.fullScreen}>
            <View style={styles.popup}>
              <Text style={styles.incorrect}>TRY AGAIN</Text>
            </View>
          </View>
        </View>}
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
  correct: {
    color: '#4CCA51',
    fontSize: 40,
    fontWeight: 'bold',
  },
  incorrect: {
    color: '#CA4C4C',
    fontSize: 40,
    fontWeight: 'bold'
  },
  gameover: {
    color: '#df0772',
    fontSize: 40,
    fontWeight: 'bold'
  },
  gameoverText: {
    color: '#3E3264',
    fontSize: 18
  },
  popup: {
    width: "80%",
    height: '10%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  score: {
    position: 'absolute',
    color: 'white',
    fontSize: 26,
    top: 50,
    right: '5%',
    fontWeight: 'bold'
  },
  lives: {
    position: 'absolute',
    color: 'white',
    fontSize: 26,
    top: 90,
    right: '5%',
    fontWeight: 'bold',
    flexDirection: 'row-reverse',
    width: 75
  },
  heart: {
    width: 25,
    height: 20,
    resizeMode: 'contain'
  },
  targetWord: {
    position: 'absolute',
    color: 'white',
    fontSize: 40,
    bottom: 50,
    left: '43%'
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
    left: '5%',
    borderRadius: '100',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

