import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';
import Communication from './game/Communication';
import SelectList from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Home(props) {

    const [groundControlStatus, setGroundControlStatus] = useState();
    const [pilotStatus, setPilotStatus] = useState();
    const [selectedTopic, setSelectedTopic] = useState();
    const [topicList, setTopicList] = useState({ key: "", value: "" });

    useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db, '/topics/');
        let listWords = [];
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = { key: childSnapshot.id, value: childSnapshot.key };
                listWords.push(childKey);
            }, setTopicList(listWords));
        },
            {
                onlyOnce: true
            });
    }, [topicList]);

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

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/topic');
        onValue(reference, (snapshot) => {
            setSelectedTopic(snapshot.val());
        });
    }, [selectedTopic]);

    return (
        <View style={styles.background}>
            {(!groundControlStatus && !pilotStatus) &&
                <View>
                    <Text style={styles.topicHeader}>Select a topic:</Text>
                    <SelectList
                        onSelect={() => Communication.SetTopic(selectedTopic)}
                        inputStyles={styles.dropdown}
                        boxStyles={styles.boxStyles}
                        dropdownTextStyles={styles.dropdownTextStyles}
                        dropdownItemStyles={styles.dropdownItemStyles}
                        dropdownStyles={styles.dropdownStyles}
                        setSelected={setSelectedTopic}
                        data={topicList}
                        searchicon={<Icon name="book-search" size={25} color="lightgrey" style={{ marginRight: 10 }} />}
                        search={true}
                        placeholder="Select a topic"
                        searchPlaceholder="Search"
                    />
                </View>}

                {(groundControlStatus || pilotStatus) &&
                <View>
                    <Text style={styles.topicSelected}>Selected topic: <Text style={styles.topicSelectedWord}>{selectedTopic}</Text></Text>
                </View>}

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
    topicHeader: {
        fontWeight: 'bold',
        fontSize: 24,
        width: '95%',
        marginTop: '10%',
        color: '#000000',
        textAlign: 'left'
    },
    topicSelected: {
        fontWeight: 'bold',
        fontSize: 24,
        width: '95%',
        marginTop: '10%',
        marginLeft: '-21%',
        color: '#000000',
        textAlign: 'left'
    },
    topicSelectedWord: {
        fontWeight: 'normal'
    },
    modeheader: {
        fontWeight: 'bold',
        fontSize: 24,
        width: '95%',
        marginTop: '10%',
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
    },
    dropdown: {
        width: "72%",
        color: 'black',
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 'bold',

    },
    boxStyles: {
        marginTop: '8%'
    },
    dropdownTextStyles: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default Home;