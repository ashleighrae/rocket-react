import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import Communication from './game/Communication';

export default class Home extends Component {
    render() {
        return (

            <ImageBackground
                source={require('./assets/img/background.png')}
                style={styles.background}
            >
                <View>
                    <Image
                        source={require('./assets/img/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    >
                    </Image>

                    <TouchableOpacity
                        onPress={() => {
                            Communication.PilotStatus(true);
                            this.props.navigation.navigate('PilotMode');
                        }}
                    >
                        <Text style={styles.signup}>Pilot</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Communication.GroundControlStatus(true);
                            this.props.navigation.navigate('GroundControlMode');
                        }}
                    >
                        <Text style={styles.login}>Ground Control</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black'
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
    signup: {
        backgroundColor: '#fffdff',
        color: '#df0772',
        width: "75%",
        borderRadius: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: '11%',
        padding: "2%",
        fontSize: 27,
        marginTop: '10%'
    },
    login: {
        backgroundColor: '#fffdff',
        color: '#df0772',
        width: "75%",
        borderRadius: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: '11%',
        padding: "2%",
        fontSize: 27,
        marginTop: '10%'
    }
});