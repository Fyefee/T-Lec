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
import * as DocumentPicker from 'expo-document-picker';

import NavigationBar from '../components/NavigationBar'
import Appbar from '../components/Lecture/AppBar'


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

export default function CreateLec({ route, navigation }) {

    const { user } = route.params;

    let [lecture, setLecture] = React.useState({
        "contact": "Jeffyyyy",
        "description": "Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah",
        "permission": [
            "62070000@it.kmitl.ac.th",
            "62070999@it.kmitl.ac.th",
        ],
        "privacy": "private",
        "tag": [
            "Test",
            "Kuy",
        ],
        "title": "Test",
        "uploadedFile": [
            {
                "mimeType": "application/pdf",
                "name": "1ใบเซ็นชื่อเตรียมสอนแก้ไข06016317-OOP-อ.ธราวิเชษฐ์-กย.64.pdf",
                "size": 1433923,
                "type": "success",
                "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540jeffy34931%252FTLec/DocumentPicker/00990b16-a405-4dfd-890b-d4ceca474f6b.pdf",
            },
        ],
    })

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

    const renderTagText = () => {
        let text = "";
        lecture.tag.map((element, index) => {
            if (index != lecture.tag.length-1){
                text += element + ", "
            } else {
                text += element
            }
        })
        return text;
    }

    return (
        <NativeBaseProvider theme={theme}>
            <LinearGradient start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#c5d8ff', '#fedcc8']}
                style={styles.container}>
                <Appbar name={lecture.title} />
                <ScrollView
                    _contentContainerStyle={{
                        py: 3,
                        px: 6,
                    }}
                    style={styles.scrollStyle}
                >
                    <Box>
                        <HStack space="5" px="3">
                            <Image source={{ uri: user.image, }}
                                alt="Alternate Text" style={styles.profileImage} />
                            <HStack space="0" pt="2" direction='column' style={styles.profileBox}>
                                <Text pt="1" fontFamily="body" fontWeight="700" style={styles.profileText}>{user.firstname} {user.lastname}</Text>
                                <Text pt="1" fontFamily="body" fontWeight="700" style={styles.profileText}>Contact : {lecture.contact}</Text>
                            </HStack>
                        </HStack>

                        <HStack space="1" px="4" mt="3" direction='column'>
                            <Text pt="1" fontFamily="body" fontWeight="700" style={styles.descriptionText}>{lecture.description}</Text>
                            <Text pt="1" fontFamily="body" fontWeight="400" style={styles.tagText}>Tag : {renderTagText()}</Text>
                        </HStack>

                        <HStack space="1" px="4" mt="3">
                        <TouchableOpacity style={styles.chooseFileButton} px="3"><Text style={{ color: "white" }}>Download</Text></TouchableOpacity>
                            <Text pt="1" fontFamily="body" fontWeight="400" style={styles.tagText}>Tag : {renderTagText()}</Text>
                        </HStack>
                    </Box>

                </ScrollView>

                <NavigationBar page={"Lecture"} />
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
        marginTop: getScreenHeight() * 0.1,
        marginBottom: getScreenHeight() * 0.11,
    },
    profileImage: {
        width: getScreenWidth() * 0.16,
        height: getScreenWidth() * 0.16,
        borderRadius: getScreenWidth() * 0.16,
    },
    profileText: {
        fontSize: normalize(16)
    },
    profileBox: {
        width: "75%"
    },
    descriptionText: {
        fontSize: normalize(15)
    },
    tagText: {
        fontSize: normalize(15)
    },
    chooseFileButton: {
        borderRadius: 10,
        backgroundColor: "#ffb287",
        justifyContent: "center",
        alignItems: "center",
    },
});
