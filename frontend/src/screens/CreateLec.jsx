import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native'
import axios from 'axios';
import { API_LINK, CLIENTID } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import { VStack, HStack, Button, IconButton, Icon, Text, NativeBaseProvider, Center, Box, StatusBar, extendTheme, ScrollView, Image, Select, CheckIcon } from "native-base";
import { FontAwesome } from '@expo/vector-icons';

import NavigationBar from '../components/navigationBar'
import Appbar from '../components/CreateLec/AppBar'


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

    let [privacy, setPrivacy] = React.useState("")

    const { user } = route.params;

    const theme = extendTheme({
        fontConfig: {
            Prompt: {
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
            <LinearGradient start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#c5d8ff', '#fedcc8']}
                style={styles.container}>
                <Appbar />
                <ScrollView
                    _contentContainerStyle={{
                        py: 3,
                        px: 6,
                    }}
                    style={styles.scrollStyle}
                >
                    <Box>
                        <HStack space="5">
                            <Image source={{ uri: user.image, }}
                                alt="Alternate Text" style={styles.profileImage} />
                            <HStack space="0" direction='column'>
                                <Text pt="4" fontFamily="body" fontWeight="700" style={styles.profileText}>{user.firstname} {user.lastname}</Text>
                                <Select
                                variant="styled"
                                    selectedValue={privacy}
                                    placeholder="Select privacy"
                                    onValueChange={(itemValue) => setPrivacy(itemValue)}
                                    _selectedItem={{
                                        endIcon: <CheckIcon size={4} />,
                                    }}
                                    style={styles.privacySelector}
                                    fontFamily="body" fontWeight="700"
                                >
                                    <Select.Item label="Public" value="public"/>
                                    <Select.Item label="Private" value="private" />
                                </Select>
                            </HStack>
                        </HStack>

                    </Box>

                </ScrollView>
                <NavigationBar page={"CreateLec"} />
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
        width: getScreenWidth() * 0.2,
        height: getScreenWidth() * 0.2,
        borderRadius: getScreenWidth() * 0.2,
    },
    profileText: {
        fontSize: normalize(18)
    },
    privacySelector:{
        fontSize: normalize(15),
        backgroundColor: "#fedcc8",
    },
});
