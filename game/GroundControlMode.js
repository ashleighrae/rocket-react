import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, AppState } from 'react-native';
import Constants from './Constants';
import Communication from './Communication';
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TypeWriter from 'react-native-typewriter';

function GroundControl(props) {

    const [word, setWord] = useState("waiting...");
    const [context, setContext] = useState(" ");
    const [lives, setLives] = useState(null);
    const [score, setScore] = useState(null);
    const [status, setStatus] = useState(null);
    const [gameOver, setGameOver] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [pilotStatus, setPilotStatus] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/pilot');
        onValue(reference, (snapshot) => {
            setPilotStatus(snapshot.val());
        });
    }, [pilotStatus]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/word');
        onValue(reference, (snapshot) => {
            setIsDeleting(false);
            setWord("");
            setWord(snapshot.val());
        });
    }, [word]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/context');
        onValue(reference, (snapshot) => {
            setIsDeleting(false);
            setContext("");
            setContext(snapshot.val());
        });
    }, [context]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/lives');
        onValue(reference, (snapshot) => {
            setIsDeleting(true);
            setLives(snapshot.val());
        });
        if (lives != 3) {
            setCorrectAnswer(false);
        }

        const timer = setTimeout(() => {
            setIsDeleting(false);
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, [lives]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/score');
        onValue(reference, (snapshot) => {
            setIsDeleting(true);
            setScore(snapshot.val());
        });
        if (score != 0) {
            setCorrectAnswer(true);
        }

        const timer = setTimeout(() => {
            setIsDeleting(false);
        }, 1000);

        return () => {
            clearTimeout(timer);
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
            {!gameOver && pilotStatus &&
                <TypeWriter
                    typing={isDeleting ? -1 : 1}
                    style={styles.targetWord} >{word}</TypeWriter>}
            {!gameOver && pilotStatus &&
                <TypeWriter style={styles.context} typing={isDeleting ? -1 : 1}>{context}</TypeWriter>

            }
            <TouchableOpacity onPress={() => {
                Communication.GroundControlStatus(false);
                props.navigation.navigate('ModeSelection');
            }} style={styles.close}>
                <Icon name={'close'} color='white' style={{ fontSize: 30 }} />
            </TouchableOpacity>
            {!pilotStatus && <View style={styles.fullScreenButton}>
                <View style={styles.fullScreen}>
                    <View style={styles.popup}>
                        <Text style={styles.gameover}>WAITING FOR PLAYER</Text>
                    </View>
                </View>
            </View>}
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
        position: 'absolute',
        color: '#df0772',
        fontSize: 34,
        top: '30%',
        fontWeight: 'bold',
        width: '65%',
        textAlign: 'center',
        whiteSpace: 'norml'
    },
    context: {
        position: 'absolute',
        top: '45%',
        color: 'black',
        fontSize: 20,
        fontWeight: 'normal',
        width: 230,
        textAlign: 'center',
        whiteSpace: 'norml'
    },
    lives: {
        position: 'absolute',
        top: '14%',
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
        top: '13.2%',
        left: '21%',
        fontWeight: 'bold',
        backgroundColor: 'white'
    },
    close: {
        backgroundColor: '#FE546F',
        position: 'absolute',
        color: 'white',
        padding: '1%',
        top: 60,
        left: '5%',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 200
    },
    gameover: {
        color: '#df0772',
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        whiteSpace: 'norml'
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