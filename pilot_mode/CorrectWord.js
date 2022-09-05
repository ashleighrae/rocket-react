import React, { Component } from "react";
import { View, Text } from "react-native";
import translation from "./Translations";

export default class CorrectWord extends Component {
    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        const correctWord = translation.GetCorrectTranslation();

        return (
            <View
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    alignSelf: "flex-start",
                    padding: 20,
                    backgroundColor: this.props.color
                }}>
                <Text>{this.props.correctTranslation}</Text>
            </ View>
        );
    }
}