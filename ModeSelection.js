import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';
import Communication from './game/Communication';

function Home(props)  {

    const [groundControlStatus, setGroundControlStatus] = useState();
    const [pilotStatus, setPilotStatus] = useState();

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/groundcontrol');
        onValue(reference, (snapshot) => {
            setGroundControlStatus(snapshot.val());
        });
    }, [groundControlStatus]);
    
    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/pilot');
        onValue(reference, (snapshot) => {
            setPilotStatus(snapshot.val());
        });
    }, [pilotStatus]);

        return (
            <View style={styles.background}>
                <Text style={styles.modeheader}>Select a mode:</Text>

                <TouchableOpacity
                    onPress={() => {
                        Communication.PilotStatus(true);
                    props.navigation.navigate('PilotMode');
                    }}
                    style={[styles.startbutton, pilotStatus && styles.disabled]}
                    disabled={pilotStatus}
                >
                    <Text style={styles.start}>Pilot</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        Communication.GroundControlStatus(true);
                        props.navigation.navigate('GroundControlMode');
                    }}
                    style={[styles.startbutton, groundControlStatus && styles.disabled]}
                    disabled={groundControlStatus}
                >
                    <Text style={styles.start}>Ground Control</Text>
                </TouchableOpacity>
            </View>
        )
    
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    modeheader: {
        fontWeight: 'bold',
        fontSize: 24,
        width: '95%',
        marginTop: '25%',
        marginLeft: '15%',
        color: '#000000',
        textAlign: 'left'
    },
    startbutton: {
        width: "80%",
        borderRadius: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '8%',
        backgroundColor: '#3E3264'
    },
    start: {
        color: '#FFFDFF',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: "5%",
        fontSize: 16,
    },
    disabled: {
        backgroundColor: '#D5D4D9'
    }
});

export default Home;