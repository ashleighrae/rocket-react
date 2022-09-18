import React, { Component } from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";

export default class CorrectWord extends Component {
    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;

        const image = this.props.ranGalaxy;

        return (

            <ImageBackground source={image} resizeMode="cover" style={{
                position: "absolute",
                left: x,
                top: y,
                alignSelf: "flex-start",
                justifyContent: "center",
                width: 'auto',
                height: 'auto',
                padding: 30
            }}>
                <View
                    style={{
                        padding: 5,
                        fontSize: 20,
                        backgroundColor: 'white',
                        color: 'black',
                        fontWeight: 'bold',
                        borderRadius: 20
                    }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}>{this.props.translation}</Text>
                </ View>
            </ImageBackground>

        );
    }
}