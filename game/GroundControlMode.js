import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, AppState } from 'react-native';
import Constants from './Constants';
import Communication from './Communication';
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function GroundControl(props) {

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
            <Image source={require('../assets/img/controlroom.png')} style={styles.backgroundImage} resizeMode="stretch"/>
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
        color: 'black',
        fontSize: 40,
        top: 100,
        textShadowColor: '#444444',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        fontFamily: 'Arial'
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