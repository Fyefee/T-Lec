import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, Easing, Image, Animated, PixelRatio, Platform, Linking, TouchableOpacity, Alert } from 'react-native'
import * as Font from 'expo-font';
import * as Google from 'expo-google-app-auth';
import { Restart } from 'fiction-expo-restart';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { API_LINK, CLIENTID } from '@env';
import { LinearGradient } from 'expo-linear-gradient';

import {
    useFonts,
    Prompt_100Thin,
    Prompt_100Thin_Italic,
    Prompt_200ExtraLight,
    Prompt_200ExtraLight_Italic,
    Prompt_300Light,
    Prompt_300Light_Italic,
    Prompt_400Regular,
    Prompt_400Regular_Italic,
    Prompt_500Medium,
    Prompt_500Medium_Italic,
    Prompt_600SemiBold,
    Prompt_600SemiBold_Italic,
    Prompt_700Bold,
    Prompt_700Bold_Italic,
    Prompt_800ExtraBold,
    Prompt_800ExtraBold_Italic,
    Prompt_900Black,
    Prompt_900Black_Italic
} from '@expo-google-fonts/prompt'

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
    const spinValue = new Animated.Value(0);
    const spinValue2 = new Animated.Value(0);
    const spinValue3 = new Animated.Value(0);
    const starMoveValue = new Animated.Value(0);
    const starScaleValue = new Animated.Value(0);
    const starSpinValue = new Animated.Value(0);

    const [user, setUser] = useState(null);

    let [fontsLoaded] = useFonts({
        Prompt_700Bold,
    });

    useEffect(() => {
        if (!user) {
            getSession()
        }
        Animated.loop(
            Animated.parallel([
                Animated.timing(
                    spinValue,
                    {
                        toValue: 1,
                        duration: 15000,
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
                    spinValue3,
                    {
                        toValue: 1,
                        duration: 35000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                        isInteraction: false,
                        iterations: -1
                    }
                ),
                Animated.timing(
                    starMoveValue,
                    {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                        isInteraction: false,
                        iterations: -1
                    }
                ),
                Animated.timing(
                    starScaleValue,
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
                    starSpinValue,
                    {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                        isInteraction: false,
                        iterations: -1
                    }
                )])
        ).start();
    }, [spinValue, spinValue2, starMoveValue])

    const getSession = async () => {
        const userSession = await axios.get(`${API_LINK}/getSession`)
        if (userSession.data) {
            setUser(userSession.data)
            console.log("Get session YAY!!")
            Actions.home()
        }
    }

    const signIn = async () => {
        try {
            const { type, accessToken, user } = await Google.logInAsync({
                clientId: CLIENTID,
                scopes: ["profile", "email"]
            })
            if (type === "success") {
                const response = await axios.post(`${API_LINK}/`, user);
                if (response.data == "wrong domain") {
                    Alert.alert("Please login with @it.kmitl.ac.th mail")
                }
                else {
                    getSession()
                }

            } else {
                console.log("cancelled")
            }

        } catch (e) {
            console.log("error", e)
            Restart()
        }
    }

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const spin2 = spinValue2.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg']
    })

    const spin3 = spinValue3.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const move_star1 = starMoveValue.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, 5, 0, -5, -1]
    })

    const scale_star = starScaleValue.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [1, 0.8, 1, 1.2, 1]
    })

    const spin_star = starSpinValue.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: ['0deg', '-10deg', '0deg', '10deg', '0deg']
    })

    if (!fontsLoaded) {
        return <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#c5d8ff', '#fedcc8']} style={styles.container}/>
    } else {
        return (
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#c5d8ff', '#fedcc8']} style={styles.container}>
                <Image style={styles.circleDecoration} source={require("../assets/Login_pic_frame/circle.png")}></Image>
                <Image style={styles.circleDecoration2} source={require("../assets/Login_pic_frame/circle.png")}></Image>
                <TouchableOpacity style={styles.button} onPress={signIn}>
                    <Animated.Image style={[styles.circleBorder, { transform: [{ rotate: spin }] }]} source={require("../assets/Login_pic_frame/frame1.png")}></Animated.Image>
                    <Animated.Image style={[styles.circleBorder2, { transform: [{ rotate: spin2 }] }]} source={require("../assets/Login_pic_frame/frame2.png")}></Animated.Image>
                    <Animated.Image style={[styles.circleBorder3, { transform: [{ rotate: spin3 }] }]} source={require("../assets/Login_pic_frame/frame3.png")}></Animated.Image>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require("../assets/logo/logo_color_dino.png")}></Image>
                        <Text style={styles.loginText}>LOGIN</Text>
                    </View>
                </TouchableOpacity>
                <Animated.Image style={[styles.star_decration1, { transform: [{ translateY: move_star1 }] }]} source={require("../assets/decoration/star2.png")}></Animated.Image>
                <Animated.Image style={[styles.star_decration2, { transform: [{ scale: scale_star }] }]} source={require("../assets/decoration/star.png")}></Animated.Image>
                <Animated.Image style={[styles.star_decration3, { transform: [{ rotate: spin_star }] }]} source={require("../assets/decoration/star3.png")}></Animated.Image>

            </LinearGradient>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
        overflow: "hidden"
    },
    button: {
        flex: 1,
        width: (Dimensions.get('window').width * 0.7),
        height: Dimensions.get('window').width * 0.7,
        position: "absolute",
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').width * 0.5,
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: Dimensions.get('window').width * 0.04,
    },
    logo: {
        width: (Dimensions.get('window').width * 0.35),
        height: Dimensions.get('window').width * 0.35,
        position: "absolute",
        top: (Dimensions.get('window').width * 0.025),
        left: Dimensions.get('window').width * 0.1,
    },
    loginText: {
        position: "relative",
        fontSize: normalize(24),
        fontFamily: "Prompt_700Bold",
    },
    star_decration1: {
        width: (Dimensions.get('window').height * 0.15),
        height: Dimensions.get('window').height * 0.15,
        position: "absolute",
        top: (Dimensions.get('window').height * 0.125),
        left: Dimensions.get('window').width * 0.675,
    },
    star_decration2: {
        width: (Dimensions.get('window').height * 0.08),
        height: Dimensions.get('window').height * 0.08,
        position: "absolute",
        top: (Dimensions.get('window').height * 0.78),
        left: Dimensions.get('window').width * 0.8,
    },
    star_decration3: {
        width: (Dimensions.get('window').height * 0.2),
        height: Dimensions.get('window').height * 0.2,
        position: "absolute",
        top: (Dimensions.get('window').height * 0.65),
        left: Dimensions.get('window').width * 0.05,
    },
    circleBorder: {
        width: (Dimensions.get('window').width * 0.575),
        height: Dimensions.get('window').width * 0.575,
        position: "absolute",
        alignSelf: 'center',
    },
    circleBorder2: {
        width: (Dimensions.get('window').width * 0.665),
        height: Dimensions.get('window').width * 0.665,
        position: "absolute",
        alignSelf: 'center',
    },
    circleBorder3: {
        width: (Dimensions.get('window').width * 0.685),
        height: Dimensions.get('window').width * 0.685,
        position: "absolute",
        alignSelf: 'center',
    },
    circleDecoration: {
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
        position: 'absolute',
        top: (Dimensions.get('window').width * -0.25),
        left: (Dimensions.get('window').width * -0.25)
    },
    circleDecoration2: {
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
        position: 'absolute',
        top: (Dimensions.get('window').width * 1.2),
        left: (Dimensions.get('window').width * 0.55)
    },
});
