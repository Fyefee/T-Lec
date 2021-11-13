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

export default function Library({ route, navigation }) {

    const { user } = route.params;

    let [userInfo, setUserInfo] = React.useState(
        {
            "rating": 4.3,
            "postCount": 15,
            "userFollower": 100,
            "userFollowing": 50
        }
    )

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

    const renderStar = () => {
        let star = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= userInfo.rating) {
                star.push(
                    <FontAwesome key={i} name="star" style={styles.starIcon} />
                )
            } else {
                star.push(
                    <FontAwesome key={i} name="star-o" style={styles.starIcon} />
                )
            }
        }
        return star;
    }

    return (
        <NativeBaseProvider theme={theme}>
            <Appbar user={user} />
            <ScrollView
                _contentContainerStyle={{
                    pt: 6,
                    pb: 3,
                    px: 5,
                }}
                style={styles.scrollStyle}
            >
                <LinearGradient start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#c5d8ff', '#fedcc8']}
                    style={styles.userCard}
                >
                    <HStack space="0" justifyContent="space-around">
                        <HStack space="2" py="5" px="5" direction='column'>
                            <Image mt="2" source={{ uri: user.image }}
                                alt="UserIcon" style={styles.userImage} />
                            <Text pt="1" fontFamily="body" fontWeight="700" style={styles.cardUserName}>{user.firstname}{"\n"}{user.lastname}</Text>
                        </HStack>

                        <HStack space="4" py="9" pr="4" direction='column'>
                            <Text pt="1" fontFamily="body" fontWeight="700" style={styles.cardRatingText}>Rating {userInfo.rating}</Text>
                            <HStack space="1" justifyContent="center">
                                {renderStar()}
                            </HStack>
                            <HStack space="3" justifyContent="space-between">
                                <HStack space="1" direction='column'>
                                    <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>Post</Text>
                                    <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>{userInfo.postCount}</Text>
                                </HStack>
                                <HStack space="1" direction='column'>
                                    <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>Follower</Text>
                                    <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>{userInfo.userFollower}</Text>
                                </HStack>
                                <HStack space="1" direction='column'>
                                    <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>Following</Text>
                                    <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>{userInfo.userFollowing}</Text>
                                </HStack>
                            </HStack>
                        </HStack>

                    </HStack>


                </LinearGradient>
            </ScrollView>
            <NavigationBar page={"Library"} />
        </NativeBaseProvider>
    );

}

const styles = StyleSheet.create({
    scrollStyle: {
        width: '100%',
        marginTop: getScreenHeight() * 0.1,
        marginBottom: getScreenHeight() * 0.11,
        backgroundColor: "#fef1e6"
    },
    userCard: {
        width: "100%",
        height: getScreenHeight() * 0.3,
        borderRadius: getScreenWidth() * 0.03
    },
    userImage: {
        width: getScreenWidth() * 0.25,
        height: getScreenWidth() * 0.25,
        borderRadius: getScreenWidth() * 0.25 / 2,
    },
    cardUserName: {
        fontSize: normalize(15),
        maxWidth: getScreenWidth() * 0.35,
        textAlign: "center"
    },
    starIcon: {
        fontSize: normalize(22),
        color: "#ffd259"
    },
    cardRatingText: {
        fontSize: normalize(16),
        textAlign: "center"
    },
    cardDetailText: {
        fontSize: normalize(14),
        textAlign: "center"
    },
});
