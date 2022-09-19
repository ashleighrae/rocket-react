import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, AppState } from 'react-native';
import Constants from './Constants';
import Communication from './Communication';
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function GroundControl(props) {

    const [word, setWord] = useState("");
    const [lives, setLives] = useState();
    const [score, setScore] = useState();
    const [status, setStatus] = useState();

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/word');
        onValue(reference, (snapshot) => {
            setWord(snapshot.val());
        });
    }, [word]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/lives');
        onValue(reference, (snapshot) => {
            setLives(snapshot.val());
        });
    }, [lives]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/score');
        onValue(reference, (snapshot) => {
            setScore(snapshot.val());
        });
    }, [lives]);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/status');
        onValue(reference, (snapshot) => {
            setStatus(snapshot.val());
        });
    }, [status]);

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
            <Text style={styles.targetWord}>{word}</Text>
            <TouchableOpacity onPress={() => {
                Communication.GroundControlStatus(false);
                props.navigation.navigate('ModeSelection');
            }} style={styles.close}>
                <Icon name={'close'} color='white' size='30' />
            </TouchableOpacity>
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
        fontSize: 40,
        top: 300,
        fontWeight: 'bold'
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
        alignItems: 'center'
    }
});

export default GroundControl;