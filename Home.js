import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Image } from 'react-native';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            floatValue: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.startFloating();
    }

    startFloating() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.floatValue, {
                    toValue: 10,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.floatValue, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }

    render() {
        const floatAnimation = {
            transform: [{ translateY: this.state.floatValue }],
        };

        return (
            <View style={styles.background}>
                <Animated.Image
                    source={require('./assets/img/galaxyTwo.png')}
                    style={[styles.logoimg, floatAnimation]}
                    resizeMode="contain"
                />
                <Image
                    source={require('./assets/img/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.subheading}>
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
        );
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
    marginTop: '5%',
    marginBottom: '40%',
    fontWeight: 'normal',
    fontSize: 18,
    color: '#3E3264'
    },
    startbutton: {
    width: "80%",
    borderRadius: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20%',
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