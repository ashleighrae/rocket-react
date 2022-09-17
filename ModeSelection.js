import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import Communication from './game/Communication';

export default class Home extends Component {
    render() {
        return (
            <View style={styles.background}>
                <Text style={styles.modeheader}>Select a mode:</Text>

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
    }
});