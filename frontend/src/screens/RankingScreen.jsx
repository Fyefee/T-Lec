import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity, View } from 'react-native'
import axios from 'axios';
import { API_LINK, CLIENTID } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Input, TextArea, VStack, HStack, Button, IconButton, Icon, Text,
    NativeBaseProvider, Center, Box, StatusBar, extendTheme, ScrollView,
    Image, Select, CheckIcon, Item, Modal, FormControl
} from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import NavigationBar from '../components/NavigationBar'

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

export default function Ranking({ route, navigation }) {

    const { user } = route.params;

    let [ranking, setRanking] = React.useState([
        {
            "ranking": 1,
            "owner": "Jeffy",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec1",
            "downloadCount": 159,
        },
        {
            "ranking": 2,
            "owner": "Boos",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec2",
            "downloadCount": 109
        },
        {
            "ranking": 3,
            "owner": "Owner1",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec3",
            "downloadCount": 100
        },
        {
            "ranking": 4,
            "owner": "Owner2",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec4",
            "downloadCount": 92
        },
        {
            "ranking": 5,
            "owner": "Owner3",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec5",
            "downloadCount": 68
        },
        {
            "ranking": 6,
            "owner": "Owner4",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec6",
            "downloadCount": 54
        },
        {
            "ranking": 7,
            "owner": "Owner5",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec7",
            "downloadCount": 15
        },
        {
            "ranking": 8,
            "owner": "Owner6",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec8",
            "downloadCount": 3
        },
    ])

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

    return (
        <NativeBaseProvider theme={theme}>
            <NavigationBar page={"Ranking"} />
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
    
});
