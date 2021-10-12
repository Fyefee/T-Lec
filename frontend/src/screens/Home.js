import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, Easing, Image, Animated, PixelRatio, Platform, Linking, TouchableOpacity } from 'react-native'
import * as Font from 'expo-font';
import * as Google from 'expo-google-app-auth';
import { Restart } from 'fiction-expo-restart';
import * as WebBrowser from 'expo-web-browser';
import * as GoogleSignIn from 'expo-google-sign-in';
import axios from 'axios';
import { API_LINK } from '@env';

let customFonts = {
    'Kanit': require('../assets/fonts/Kanit-Light.ttf'),
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

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (user != null) {
            getSession()
        }
    })

    const getSession = async () => {
        const userSession = await axios.get(`${API_LINK}/getSession`)
        setUser(userSession.data)
    }


    return (
        <View style={styles.container}>

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
        justifyContent: 'center',
        overflow: "hidden"
    },
});
