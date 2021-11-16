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
                300: {
                    normal: 'Prompt-Regular',
                },
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
            "lecName": "Mobile Device",
            "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "lecTag": [
                "MobileDevice",
                "ปี3_เทอม1_final"
            ],
            "lecDescription": "Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World!",
            "lecRating": 4
        },
        {
            "lecName": "SOP",
            "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "lecTag": [
                "MobileDevice",
                "ปี3_เทอม1_final"
            ],
            "lecDescription": "Hello",
            "lecRating": 5
        },
        {
            "lecName": "Mobile Device",
            "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "lecTag": [
                "MobileDevice",
                "ปี3_เทอม1_final"
            ],
            "lecDescription": "Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World!",
            "lecRating": 4
        },
        {
            "lecName": "SOP",
            "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "lecTag": [
                "MobileDevice",
                "ปี3_เทอม1_final"
            ],
            "lecDescription": "Hello",
            "lecRating": 5
        },
        {
            "lecName": "Mobile Device",
            "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "lecTag": [
                "MobileDevice",
                "ปี3_เทอม1_final"
            ],
            "lecDescription": "Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World!",
            "lecRating": 4
        },
    ])

    let [newLec, setNewLec] = React.useState([
        {
            "lecName": "Mobile Device",
            "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "lecTag": [
                "MobileDevice",
                "ปี3_เทอม1_final"
            ],
            "lecDescription": "Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World!",
            "lecRating": 4
        },
        {
            "lecName": "SOP",
            "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "lecTag": [
                "MobileDevice",
                "ปี3_เทอม1_final"
            ],
            "lecDescription": "Hello",
            "lecRating": 5
        },
        {
            "lecName": "Mobile Device",
            "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "lecTag": [
                "MobileDevice",
                "ปี3_เทอม1_final"
            ],
            "lecDescription": "Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World!",
            "lecRating": 4
        },
        {
            "lecName": "SOP",
            "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "lecTag": [
                "MobileDevice",
                "ปี3_เทอม1_final"
            ],
            "lecDescription": "Hello",
            "lecRating": 5
        },
    ])

    const renderRecentViewBox = () => {
        let BoxArray = [];
        recentView.map((element, index) => {
            BoxArray.push(
                <LinearGradient start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#ddeaf8', '#fff2e2']}
                    key={index} style={styles.recentViewBox}>
                    <HStack space="1" py="1" px="1" direction='column'>
                        <Image source={{ uri: element.photoUrl, }} alt="User Image" style={styles.profileRecentImage} />
                        <Text pt="1" pl="2" fontFamily="body" fontWeight="400" style={styles.textRecentHeader} numberOfLines={1}>{element.lecName}</Text>
                        <Text pl="2" fontFamily="body" fontWeight="300" style={styles.textRecentTag} lineHeight="2xs" numberOfLines={2}>Tag : {renderNewLecTag(element)}</Text>
                        <HStack pl="3">
                            {renderStar(element, styles.starIconRecent)}
                        </HStack>
                    </HStack>
                </LinearGradient>
            )
        })
        return BoxArray;
    }

    const renderNewLecBox = () => {
        let BoxArray = [];
        newLec.map((element, index) => {
            BoxArray.push(
                <Box key={index} style={styles.newLecBox}>
                    <HStack space="1" py="1" px="4" alignItems="center">
                        <Image source={{ uri: element.photoUrl, }} alt="User Image" style={styles.profileImage} />
                        <HStack py="1" px="1" direction='column'>
                            <Text pt="1" pl="2" fontFamily="body" fontWeight="400" style={styles.textNewLecHeader} numberOfLines={1}>{element.lecName}</Text>
                            <Text pl="2" fontFamily="body" fontWeight="300" style={styles.textNewLecTag} lineHeight="2xs" numberOfLines={1}>Tag : {renderNewLecTag(element)}</Text>
                            <Text pt="1" pl="2" fontFamily="body" fontWeight="300" style={styles.textNewLecDescription} lineHeight="2xs" numberOfLines={2}>{element.lecDescription}</Text>
                            <HStack px="1">
                                {renderStar(element, styles.starIconNewLec)}
                            </HStack>
                        </HStack>
                    </HStack>
                </Box>
            )
        })
        return BoxArray;
    }

    const renderNewLecTag = (element) => {
        let text = "";
        for (let i = 0; i < element.lecTag.length; i++) {
            if (i != element.lecTag.length - 1) {
                text += element.lecTag[i] + ", "
            } else {
                text += element.lecTag[i]
            }
        }
        return text;
    }

    const renderStar = (element, starStyle) => {
        let star = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= element.lecRating) {
                star.push(
                    <FontAwesome key={i} name="star" style={starStyle} />
                )
            } else {
                star.push(
                    <FontAwesome key={i} name="star-o" style={starStyle} />
                )
            }
        }
        return star;
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
                                px: 3,
                            }}
                            style={styles.recentViewScroll}
                            horizontal={true}
                        >
                            <HStack space="5" py="1">
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
        height: getScreenHeight() * 0.335,
    },
    recentViewBox: {
        width: getScreenWidth() * 0.35,
        height: getScreenHeight() * 0.3,
        borderRadius: getScreenWidth() * 0.025,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgb(255, 255, 255)",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    },
    textRecentHeader: {
        fontSize: normalize(14),
        alignSelf: "center",
        textAlign: "center",
    },
    textRecentTag: {
        fontSize: normalize(10),
        alignSelf: "center",
        textAlign: "center",
        color: "gray"
    },
    profileRecentImage: {
        width: getScreenWidth() * 0.15,
        height: getScreenWidth() * 0.15,
        borderRadius: getScreenWidth() * 0.15,
        alignSelf: "center",
    },
    starIconRecent: {
        fontSize: normalize(16),
        color: "#ffd259",
        marginRight: getScreenWidth() * 0.005,
    },
    newLecBox: {
        width: getScreenWidth() * 0.9,
        height: getScreenHeight() * 0.175,
        borderRadius: getScreenWidth() * 0.025,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: "rgb(255, 255, 255)",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    },
    profileImage: {
        width: getScreenWidth() * 0.14,
        height: getScreenWidth() * 0.14,
        borderRadius: getScreenWidth() * 0.14,
    },
    textNewLecHeader: {
        fontSize: normalize(17),
        alignSelf: "flex-start"
    },
    textNewLecTag: {
        fontSize: normalize(11),
        alignSelf: "flex-start",
        color: "gray"
    },
    textNewLecDescription: {
        fontSize: normalize(11),
        alignSelf: "flex-start",
        width: getScreenWidth() * 0.65,
    },
    starIconNewLec: {
        fontSize: normalize(16),
        color: "#ffd259",
        marginRight: getScreenWidth() * 0.01,
    },
});
