import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';

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
                        onPress={() => this.props.navigation.navigate('PilotMode')}
                    >
                        <Text style={styles.signup}>Pilot Mode</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.loginPressed}
                    >
                        <Text style={styles.login}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%'
    },
    logo: {
        width: '70%',
        marginTop: '-15%',
        marginLeft: '15%'
    },
    text: {
        color: 'white',
        marginTop: '-45%',
        marginLeft: '20%'
    },
    signup: {
        backgroundColor: 'white',
        color: '#3A59FF',
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
        backgroundColor: '#3A59FF',
        color: 'white',
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