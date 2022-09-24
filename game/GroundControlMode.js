import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, AppState } from 'react-native';
import Constants from './Constants';
import Communication from './Communication';
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TypeWriter from 'react-native-typewriter';

function GroundControl(props) {

    const [word, setWord] = useState("");
    const [context, setContext] = useState("");
    const [lives, setLives] = useState();
    const [score, setScore] = useState();
    const [status, setStatus] = useState();
    const [gameOver, setGameOver] = useState();
    const [correctAnswer, setCorrectAnswer] = useState();

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/word');
        onValue(reference, (snapshot) => {
            setWord(snapshot.val());
        });
    }, [word]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/context');
        onValue(reference, (snapshot) => {
            setContext(snapshot.val());
        });
    }, [context]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/lives');
        onValue(reference, (snapshot) => {
            setLives(snapshot.val());
        });
        if (lives != 3) {
            setCorrectAnswer(false);
        }
    }, [lives]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/score');
        onValue(reference, (snapshot) => {
            setScore(snapshot.val());
        });
        if (score != 0) {
            setCorrectAnswer(true);
        }
    }, [score]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/status');
        onValue(reference, (snapshot) => {
            setStatus(snapshot.val());
        });
    }, [status]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/isGameOver');
        onValue(reference, (snapshot) => {
            setGameOver(snapshot.val());
        });
    }, [gameOver]);

    let livesList = [];
    for (let i = 0; i < lives; i++) {

        livesList.push(
            <Image source={require('../assets/img/heart.png')} style={styles.heart} resizeMode="stretch" key={"heart" + i} />
        )
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/img/controlroom.png')} style={styles.backgroundImage} resizeMode="stretch" />
            <Text style={styles.score}>Score: {score}</Text>
            <View style={styles.lives}>
                {livesList}
            </View>
            <TypeWriter style={styles.targetWord} typing={1}>{word}</TypeWriter>
            <TypeWriter style={styles.context} typing={1}>{context}</TypeWriter>
            <TouchableOpacity onPress={() => {
                Communication.GroundControlStatus(false);
                props.navigation.navigate('ModeSelection');
            }} style={styles.close}>
                <Icon name={'close'} color='white' size='30' />
            </TouchableOpacity>
            {gameOver && <View style={styles.fullScreenButton}>
                <View style={styles.fullScreen}>
                    <View style={styles.popup}>
                        <Text style={styles.gameover}>GAME OVER</Text>
                    </View>
                </View>
            </View>}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        backgroundColor: 'white',
        alignItems: 'center'
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
    targetWord: {
        // position: 'absolute',
        color: '#df0772',
        fontSize: 38,
        marginTop: 220,
        fontWeight: 'bold',
        width: 230,
        textAlign: 'center',
        whiteSpace: 'norml'
    },
    context: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'normal',
        width: 230,
        textAlign: 'center',
        whiteSpace: 'norml'
    },
    lives: {
        position: 'absolute',
        top: 115,
        right: '21%',
        fontWeight: 'bold',
        flexDirection: 'row-reverse',
        width: 75
    },
    heart: {
        width: 25,
        height: 20,
        resizeMode: 'contain'
    },
    score: {
        position: 'absolute',
        color: 'black',
        fontSize: 26,
        top: 108,
        left: '21%',
        fontWeight: 'bold'
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
        alignItems: 'center',
        zIndex: 200
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
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20
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
    fullScreenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    }
});

export default GroundControl;