import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, AppState } from 'react-native';
import Constants from './Constants';
import Communication from './Communication';
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';

function GroundControl() {

    const [word, setWord] = useState("");

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/word');
        onValue(reference, (snapshot) => {
            setWord(snapshot.val());
        });
    }, [word]);

    return (
        <View style={styles.container}>
            <Text style={styles.targetWord}>{word}</Text>
        </View>
    );

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
        color: 'black',
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
    targetWord: {
        position: 'absolute',
        color: 'black',
        fontSize: 40,
        top: 50,
        left: '43%',
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

export default GroundControl;