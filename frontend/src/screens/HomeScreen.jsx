import React, { useState, useEffect } from 'react'
import { useIsFocused } from "@react-navigation/native";
import { StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native'
import axios from 'axios';
import { API_LINK, USER_SERVICE_LINK, LECTURE_SERVICE_LINK } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import {
    HStack, Text, NativeBaseProvider, Box, extendTheme, ScrollView, Spinner
} from "native-base";

import CreateLecButton from '../components/Main/CreateLecButton'
import Appbar from "../components/Main/AppBar"
import NavigationBar from '../components/NavigationBar'

import RecentViewList from '../components/Home/RecentViewList'
import NewLectureList from '../components/Home/NewLectureList'

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

        fonts: {
            heading: 'Prompt',
            body: 'Prompt',
            mono: 'Prompt',
        },
    });

    const [isLoad, setIsLoad] = React.useState(false)
    const isFocused = useIsFocused();

    useEffect(async () => {

        try {
            setIsLoad(false)

            // const notificationFromDB = await axios.get(`${USER_SERVICE_LINK}/getNotificationByEmail/${user.email}`)

            //const dataFromDB = await axios.get(`${API_LINK}/getHomeData`, { params: { email: user.email } })
        
            const dataFromDB = await axios.get(`${API_LINK}/gethomedata`, { params: { authId: user.authId } })
            // const dataFromDB = await axios.get(`${LECTURE_SERVICE_LINK}/getHomeData/${user.email}`)
            setRecentView(dataFromDB.data.recentView)
            setNewLec(dataFromDB.data.newLec)
            setNotification(dataFromDB.data.notification)
            // setNotification(notificationFromDB.data)

            setIsLoad(true)

        }
        catch (e) {
            console.log("GetData error : ", e)
        }

    }, [isFocused])


    let [recentView, setRecentView] = React.useState([])
    let [newLec, setNewLec] = React.useState([])
    let [notification, setNotification] = React.useState([])

    if (isLoad) {
        return (
            <NativeBaseProvider theme={theme}>
                <LinearGradient start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#c5d8ff', '#fedcc8']}
                    style={styles.container}>

                    <Appbar user={user} bgColor={"rgba(255,255,255,0.01)"} navigation={navigation} notification={notification} setNotification={setNotification} />
                    <ScrollView
                        _contentContainerStyle={{
                            pt: 6,
                            pb: 8,
                            px: 5,
                        }}
                        style={styles.scrollStyle}
                    >
                        <HStack space="1" direction='column'>
                            <Text pt="3" pl="2" fontFamily="body" fontWeight="700" style={styles.TextHeader}>Recently Viewed</Text>

                            {recentView.length > 0 ? (
                                    <RecentViewList recentView={recentView} navigation={navigation} user={user}/>
                                ) : (
                                    <Text pt="1" pl="5" fontFamily="body" fontWeight="700" style={styles.warningText}>You don't have any recently viewed lectures.</Text>
                                )}

                            <Text pt="5" pl="2" fontFamily="body" fontWeight="700" style={styles.TextHeader}>NEW !!</Text>
                            {newLec.length > 0 ? (
                                    <NewLectureList newLec={newLec} navigation={navigation} user={user}/>
                                ) : (
                                    <Text pt="1" pl="5" fontFamily="body" fontWeight="700" style={styles.warningText}>There are currently no new lectures.</Text>
                                )}
                            
                        </HStack>
                    </ScrollView>

                <CreateLecButton navigation={navigation} user={user} />
                <NavigationBar navigation={navigation} page={"Home"} user={user} />

                </LinearGradient>
            </NativeBaseProvider >
        );
    } else {
        return (
            <NativeBaseProvider theme={theme}>
                <LinearGradient start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#c5d8ff', '#fedcc8']}
                    style={styles.container}>
                    <Box style={styles.blankStyle}>
                        <Spinner size="lg" color="warning" />
                    </Box>
                </LinearGradient>
            </NativeBaseProvider>
        );
    }

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
        marginTop: getScreenHeight() * 0.12,
        marginBottom: getScreenHeight() * 0.10,
    },
    TextHeader: {
        fontSize: normalize(23),
        alignSelf: "flex-start",
    },
    blankStyle: {
        minHeight: getScreenHeight() * 0.3,
        justifyContent: "center"
    },
    warningText: {
        fontSize: normalize(12),
    }
});
