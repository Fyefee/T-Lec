import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity, View } from 'react-native'
import axios from 'axios';
import { API_LINK, CLIENTID } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Input, TextArea, VStack, HStack, Button, IconButton, Icon, Text,
    NativeBaseProvider, Center, Box, StatusBar, extendTheme, ScrollView,
    Image, Select, CheckIcon, Item, Modal, FormControl, AlertDialog
} from "native-base";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import Appbar from "../components/Library/AppBar"
import NavigationBar from '../components/NavigationBar'

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

export default function Home({ route, navigation }) {

    const { user } = route.params;

    const theme = extendTheme({
        fontConfig: {
            Prompt: {
                400: {
                    normal: 'Prompt-Medium',
                },
                700: {
                    normal: 'Prompt-SemiBold',
                },
            }
        },

        // Make sure values below matches any of the keys in `fontConfig`
        fonts: {
            heading: 'Prompt',
            body: 'Prompt',
            mono: 'Prompt',
        },
    });

    let [recentView, setRecentView] = React.useState([
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
        },
        {
            "name": "Test2",
        },
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
        },
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
        },
        {
            "name": "Test2",
        },
    ])

    let [newLec, setNewLec] = React.useState([
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
        },
        {
            "name": "Test2",
        },
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
        },
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
        },
    ])

    const renderRecentViewBox = () => {
        let BoxArray = [];
        recentView.map((element, index) => {
            BoxArray.push(
                <Box key={index} style={styles.recentViewBox}/>
            )
        })
        return BoxArray;
    }

    const renderNewLecBox = () => {
        let BoxArray = [];
        newLec.map((element, index) => {
            BoxArray.push(
                <Box key={index} style={styles.newLecBox}/>
            )
        })
        return BoxArray;
    }

    useEffect(() => {
    })

    return (
        <NativeBaseProvider theme={theme}>
            <LinearGradient start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={['#c5d8ff', '#fedcc8']}
                style={styles.container}>

                <Appbar user={user} bgColor={"#c5d8ff"} />
                <ScrollView
                    _contentContainerStyle={{
                        pt: 6,
                        pb: 8,
                        px: 5,
                    }}
                    style={styles.scrollStyle}
                >
                    <HStack space="4" direction='column'>
                        <Text pt="3" pl="2" fontFamily="body" fontWeight="700" style={styles.TextHeader}>Recently Viewed</Text>
                        <ScrollView
                            _contentContainerStyle={{
                                px: 5,
                            }}
                            style={styles.recentViewScroll}
                            horizontal={true}
                        >
                            <HStack space="5" pt="1" pb="1">
                                {renderRecentViewBox()}
                            </HStack>
                        </ScrollView>
                        
                        <Text pt="3" pl="2" fontFamily="body" fontWeight="700" style={styles.TextHeader}>NEW !!</Text>
                        {renderNewLecBox()}
                    </HStack>
                </ScrollView>
                <NavigationBar page={"Home"} />

            </LinearGradient>
        </NativeBaseProvider>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: "hidden"
    },
    scrollStyle: {
        width: '100%',
        height: "100%",
        marginTop: getScreenHeight() * 0.1,
        marginBottom: getScreenHeight() * 0.11,
    },
    TextHeader: {
        fontSize: normalize(23),
        alignSelf: "flex-start"
    },
    recentViewScroll: {
        width: '100%',
        height: getScreenHeight() * 0.29,
    },
    recentViewBox: {
        width: getScreenWidth() * 0.3,
        height: getScreenHeight() * 0.25,
        borderRadius: getScreenWidth() * 0.025,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    newLecBox: {
        width: getScreenWidth() * 0.9 ,
        height: getScreenHeight() * 0.15,
        borderRadius: getScreenWidth() * 0.025,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(255, 255, 255, 0.5)",
    }
});
