import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, Easing, Image, Animated,  PixelRatio, Platform } from 'react-native'
import * as Font from 'expo-font';

let customFonts = {
    'Kanit': require('../assets/fonts/Kanit-Medium.ttf'),
  };

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

const normalize = (size) => {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export default function App() {
    Font.loadAsync(customFonts);
    const spinValue = new Animated.Value(0);
    const spinValue2 = new Animated.Value(0);
    const star1MoveValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
        Animated.parallel([
            Animated.timing(
                spinValue,
                {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                    isInteraction: false,
                    iterations: -1
                }
            ),
            Animated.timing(
                spinValue2,
                {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.elastic(),
                    useNativeDriver: true,
                    isInteraction: false,
                    iterations: -1
                }
            ),
            Animated.timing(
                star1MoveValue,
                {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                    isInteraction: false,
                    iterations: -1
                }
            )])
    ).start();
    }, [spinValue, spinValue2, star1MoveValue])

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const spin2 = spinValue2.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const move_star1 = star1MoveValue.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, 5, 0, -5, -1]
    })

    const handleClick = () => {

    }

    return (
        <View style={styles.container}>
            {/* <Animated.View style={[styles.circleBorder2, { transform: [{ rotate: spin2 }] }]} /> */}
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../assets/logo/logo_color_dino.png")}></Image>
                <Text style={styles.loginText}>Login</Text>
            </View>
            <Animated.Image style={[styles.star_decration1, { transform: [{ translateY: move_star1 }] }]} source={require("../assets/decoration/star2.png")}></Animated.Image>
            <Animated.Image style={[styles.star_decration1, { transform: [{ translateY: move_star1 }] }]} source={require("../assets/decoration/star.png")}></Animated.Image>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#FFB085',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center'
    },
    logoContainer: {
        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
        backgroundColor: '#FEF1E6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: (Dimensions.get('window').width * 0.5),
        height: Dimensions.get('window').width * 0.5,
        position: "absolute",
        top: (Dimensions.get('window').width * 0.04),
        left: Dimensions.get('window').width * 0.125,
    },
    loginText: {
        position: "relative",
        top: "33%",
        fontFamily: 'Kanit',
        fontSize: normalize(26),
        fontWeight: "bold"
    },
    star_decration1: {
        width: (Dimensions.get('window').height * 0.16),
        height: Dimensions.get('window').height * 0.16,
        position: "absolute",
        top: (Dimensions.get('window').height * 0.1),
        left: Dimensions.get('window').width * 0.05,
    },
    star_decration2: {
        width: (Dimensions.get('window').height * 0.16),
        height: Dimensions.get('window').height * 0.16,
        position: "absolute",
        top: (Dimensions.get('window').height * 0.1),
        left: Dimensions.get('window').width * 0.05,
    }
});
