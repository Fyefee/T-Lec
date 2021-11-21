import React from 'react'
import { StyleSheet, Dimensions, PixelRatio } from 'react-native'
import { HStack, IconButton, Icon, Text, StatusBar, Image, KeyboardAvoidingView } from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const getScreenWidth = () => {
    // for use screen width 
    if (SCREEN_HEIGHT > SCREEN_WIDTH) {
        return SCREEN_WIDTH
    }
    else {
        return SCREEN_HEIGHT
    }
}

const getScreenHeight = () => {
    // for use screen height 
    if (SCREEN_HEIGHT > SCREEN_WIDTH) {
        return SCREEN_HEIGHT
    }
    else {
        return SCREEN_WIDTH
    }
}

const scale = getScreenWidth() / 320;

const normalize = (size) => {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export default function CreateLecButton(props) {

    const changePage = () => {
        props.navigation.navigate('CreateLec', { user: props.user })
    }

    return (
        <>
            <IconButton
              size={"lg"}
              variant="solid"
              _icon={{
                as: FontAwesome,
                name: "pencil",
              }}
              borderRadius="full"
              style={styles.button}
              onPress={() => changePage()}
            />
        </>
    );


}

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        bottom: getScreenWidth() * 0.22,
        right: getScreenWidth() * 0.06,
        borderColor: "white",
        borderWidth: 2,
        elevation: 16,
    }
});
