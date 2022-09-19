import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';

export default class Home extends Component {
    render() {
        return (
            <View style={styles.background}>
                <Image
                    source={require('./assets/img/galaxyTwo.png')}
                    style={styles.logoimg}
                    resizeMode="contain"
                ></Image>
                <Image
                    source={require('./assets/img/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                >
                </Image>
                <Text
                    style={styles.subheading}
                >
                    Gamified language learning.
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('ModeSelection');
                    }}
                    style={styles.startbutton}>
                    <Text style={styles.start}>Get Started</Text>
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
        alignItems: 'center'
    },
    logo: {
        width: '70%',
        marginTop: '-25%',
    },
    logoimg: {
        width: '50%',
        marginTop: '10%'
    },
    subheading: {
        textAlign: 'center',
        margin: 'auto',
        fontWeight: '600',
        fontSize: 18,
        color: '#3E3264'
    },
    startbutton: {
        width: "80%",
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