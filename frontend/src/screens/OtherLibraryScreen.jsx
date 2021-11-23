import React, { useState, useEffect } from 'react'
import { useIsFocused } from "@react-navigation/native";
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity, View } from 'react-native'
import axios from 'axios';
import { API_LINK, CLIENTID } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Input, TextArea, VStack, HStack, Button, IconButton, Icon, Text,
    NativeBaseProvider, Center, Box, StatusBar, extendTheme, ScrollView,
    Image, Select, CheckIcon, Item, Modal, FormControl, Wrap, AlertDialog,
    Popover, Alert, CloseIcon, Collapse, Spinner
} from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import ErrorAlert from '../components/ErrorAlert'
import CreateLecButton from '../components/Main/CreateLecButton'
import Appbar from "../components/Main/AppBar"
import NavigationBar from '../components/NavigationBar'

import UserCard from '../components/Library/UserCard'
import CollectionCard from '../components/Library/CollectionCard'

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

export default function OtherLibrary({ route, navigation }) {

    const { user } = route.params;

    let [userInfo, setUserInfo] = React.useState(
        {
            "rating": 0,
            "postCount": 0,
            "userFollower": 0,
            "userFollowing": 0
        }
    )

    const [isLoad, setIsLoad] = React.useState(false)
    const isFocused = useIsFocused();

    let [collection, setCollection] = React.useState([])
    let [notification, setNotification] = React.useState([])

    const [isAlertOpen, setIsAlertOpen] = React.useState(false)

    const [isFollow, setIsFollow] = React.useState(false)
    

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

    useEffect(async () => {

        try {
            setIsLoad(false)

            const dataFromDB = await axios.get(`${API_LINK}/getDataForLibrary`, { params: { email: route.params.ownerEmail, userEmail: user.email } })
            console.log(dataFromDB.data)
            const userLibData = {
                "userFirstName": dataFromDB.data.userFirstName,
                "userLastName": dataFromDB.data.userLastName,
                "userImage": dataFromDB.data.userImage,
                "userEmail": dataFromDB.data.userEmail,
                "rating": dataFromDB.data.rating,
                "postCount": dataFromDB.data.postCount,
                "userFollower": dataFromDB.data.userFollower,
                "userFollowing": dataFromDB.data.userFollowing
            }
            setUserInfo(userLibData);
            setCollection(dataFromDB.data.userLecture);
            setIsFollow(dataFromDB.data.isFollow)
            setNotification(dataFromDB.data.notification)
            
            setIsLoad(true)
        }
        catch (e) {
            console.log("GetData error : ", e)
        }

    }, [isFocused])

    if (isLoad) {
        return (
            <NativeBaseProvider theme={theme}>
                <Appbar user={user} bgColor={"#fef1e6"} navigation={navigation} notification={notification} setNotification={setNotification}/>
                <ScrollView
                    _contentContainerStyle={{
                        pt: 6,
                        pb: 3,
                        px: 5,
                    }}
                    style={styles.scrollStyle}
                >
                    <HStack space="4" direction='column'>
                        <UserCard isLoad={isLoad} user={user} userInfo={userInfo} isFollow={isFollow} setIsFollow={setIsFollow}/>
                        <CollectionCard isLoad={isLoad} user={user} collection={collection} navigation={navigation} setIsAlertOpen={setIsAlertOpen}/>
                    </HStack>
                </ScrollView>

                <ErrorAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen} />
                <CreateLecButton navigation={navigation} user={user} />
                <NavigationBar navigation={navigation} page={"Other Library"} user={user} />
            </NativeBaseProvider>
        );
    } else {
        return (
            <NativeBaseProvider theme={theme}>
                <Appbar user={user} bgColor={"#fef1e6"} navigation={navigation} notification={notification} setNotification={setNotification} />
                <ScrollView
                    _contentContainerStyle={{
                        pt: 6,
                        pb: 3,
                        px: 5,
                    }}
                    style={styles.scrollStyle}
                >
                    <HStack space="4" direction='column'>
                        <UserCard user={user} userInfo={userInfo} isLoad={isLoad}/>
                        <CollectionCard isLoad={isLoad} user={user} collection={collection}/>
                    </HStack>
                </ScrollView>

                <ErrorAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen} />
                <CreateLecButton navigation={navigation} user={user} />
                <NavigationBar navigation={navigation} page={"Library"} user={user} />
            </NativeBaseProvider>
        )
    }

}

const styles = StyleSheet.create({
    scrollStyle: {
        width: '100%',
        height: "100%",
        marginTop: getScreenHeight() * 0.1,
        marginBottom: getScreenHeight() * 0.11,
        backgroundColor: "#fef1e6"
    },
    collectionCard: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: "hidden",
        borderRadius: getScreenWidth() * 0.035,
        minHeight: getScreenHeight() * 0.1
    },
    collectionHeader: {
        fontSize: normalize(20),
        alignSelf: "flex-start"
    },
    collectionWrap: {
        justifyContent: "space-evenly"
    },
    collectionBox: {
        width: '30%',
        height: getScreenHeight() * 0.15,
        borderRadius: getScreenWidth() * 0.025,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        marginTop: 8
    },
    collectionBoxStack: {
        position: "absolute",
        right: 0,
        top: 0
    },
    collectionPrivacyIcon: {
        fontSize: normalize(19),
        color: "#818181",
        paddingTop: 2
    },
    collectionMoreIcon: {
        fontSize: normalize(19),
        color: "#818181",
    },
    popOverDeleteButton: {
        width: getScreenHeight() * 0.15,
    },
});
