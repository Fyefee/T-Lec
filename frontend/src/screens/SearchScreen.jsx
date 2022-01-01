import React, { useState, useEffect } from 'react'
import { useIsFocused } from "@react-navigation/native";
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity, View } from 'react-native'
import axios from 'axios';
import { API_LINK, CLIENTID, LECTURE_SERVICE_LINK } from '@env';
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

import RecentViewList from '../components/Home/RecentViewList'
import SearchList from '../components/Search/SearchList'

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

export default function SearchScreen({ route, navigation }) {

    const { user } = route.params;

    const [isLoad, setIsLoad] = React.useState(false)
    const isFocused = useIsFocused();

    const [isAlertOpen, setIsAlertOpen] = React.useState(false)

    const [searchText, setSearchText] = React.useState("")
    const [searchData, setSearchData] = React.useState([])

    const [searchDataRender, setSearchDataRender] = React.useState([])

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

            const dataFromDB = await axios.get(`${API_LINK}/getDataForSearch`)
            // const dataFromDB = await axios.get(`${LECTURE_SERVICE_LINK}/getDataForSearch`)
            setSearchData(dataFromDB.data)
            
            setIsLoad(true)
        }
        catch (e) {
            console.log("GetData error : ", e)
        }

    }, [isFocused])

    const searchInputHandler = (inputText) => {

        setSearchText(inputText);

        let searchArray = [];
        searchData.forEach(async (element, index) => {
            if (element.ownerName.includes(inputText) || element.title.includes(inputText) || element.tag.includes(inputText)){
                searchArray.push(element)
            }
        })

        setSearchDataRender(searchArray)
    };

    if (isLoad) {
        return (
            <NativeBaseProvider theme={theme}>
                <LinearGradient start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#ffe4ca', '#90aacb']}
                    style={styles.container}
                >
                    <ScrollView
                        _contentContainerStyle={{
                            pt: 8,
                            pb: 3,
                            px: 5,
                        }}
                        style={styles.scrollStyle}
                    >
                        <Text pt="5" pl="2" fontFamily="body" fontWeight="700" style={styles.TextHeader}>Search</Text>
                        <HStack space="3" px="4" pt="2" pb="3" my="3" style={styles.titleInputBox}>
                            <Icon as={<FontAwesome name="search" />} style={styles.inputIcon} />
                            <Input px="0" py="0" size="xl" variant="unstyled" fontFamily="body" fontWeight="400"
                                onChangeText={searchInputHandler}
                                value={searchText}
                                placeholder="Lectures, Authors, Tags"
                                w={{
                                    base: "80%",
                                }} />
                        </HStack>

                        <SearchList searchDataRender={searchDataRender} navigation={navigation} user={user} />

                    </ScrollView>
                </LinearGradient>

                <ErrorAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen} />
                <NavigationBar navigation={navigation} page={"Search"} user={user} />
            </NativeBaseProvider>
        );
    } else {
        return (
            <NativeBaseProvider theme={theme}>
                <LinearGradient start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#ffe4ca', '#90aacb']}
                    style={styles.container}
                >
                    <ScrollView
                        _contentContainerStyle={{
                            pt: 6,
                            pb: 3,
                            px: 5,
                        }}
                        style={styles.scrollStyle}
                    >
                        <Box style={styles.blankStyle}>
                            <Spinner size="lg" color="warning" />
                        </Box>
                    </ScrollView>
                </LinearGradient>

                <ErrorAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen} />
                <NavigationBar navigation={navigation} page={"Search"} user={user} />
            </NativeBaseProvider>
        )
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
    blankStyle: {
        minHeight: getScreenHeight() * 0.3,
        justifyContent: "center"
    },
    scrollStyle: {
        width: '100%',
        height: "100%",
        marginBottom: getScreenHeight() * 0.11,
    },
    TextHeader: {
        fontSize: normalize(28),
        alignSelf: "flex-start",
        color: "white"
    },
    inputStyle: {
        backgroundColor: "white"
    },
    titleInputBox: {
        backgroundColor: "#f7f1ed",
        borderRadius: 3,
        width: '95%',
        opacity: 0.9,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    inputIcon: {
        fontSize: normalize(24),
        color: "#999999"
    },
    boxWrap: {
        justifyContent: "space-between",
        width: "100%"
    },
    boxRender: {
        width: '46%',
        height: getScreenHeight() * 0.15,
        borderRadius: getScreenWidth() * 0.025,
        justifyContent: 'center',
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        marginTop: 8
    },
    boxText: {
        fontSize: normalize(12),
        alignSelf: "flex-start",
        textAlign: "left",
    },
});
