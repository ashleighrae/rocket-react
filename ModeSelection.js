import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import Communication from './game/Communication';

export default class Home extends Component {
    render() {
        return (
            <View style={styles.background}>
                <Text style={styles.signup}>Select a mode:</Text>

                <TouchableOpacity
                    onPress={() => {
                        Communication.PilotStatus(true);
                        this.props.navigation.navigate('PilotMode');
                    }}
                    style={styles.startbutton}
                >
                    <Text style={styles.start}>Pilot</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        Communication.GroundControlStatus(true);
                        this.props.navigation.navigate('GroundControlMode');
                    }}
                    style={styles.startbutton}
                >
                    <Text style={styles.start}>Ground Control</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    logo: {
        width: '70%',
        marginTop: '-45%',
        marginLeft: '15%'
    },
    text: {
        color: 'white',
        marginTop: '-45%',
        marginLeft: '20%'
    },
    startbutton: {
        width: "75%",
        borderRadius: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '50%',
        backgroundColor: '#FE546F'
    },
    start: {
        color: '#FFFDFF',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: "5%",
        fontSize: 16,
    }
});