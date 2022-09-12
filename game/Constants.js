import { Dimensions } from 'react-native';

const Constants = {
    MAX_WIDTH: Dimensions.get("screen").width,
    MAX_HEIGHT: Dimensions.get("screen").height,
    WORD_WIDTH: Dimensions.get("screen").width / 4,
    ROCKET_WIDTH: 50,
    ROCKET_HEIGHT: 41
}

export default Constants;