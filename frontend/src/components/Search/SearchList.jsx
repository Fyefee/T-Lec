import React from 'react'
import { StyleSheet, Dimensions, PixelRatio, TouchableOpacity } from 'react-native'
import { HStack, Text, Image } from "native-base";
import { FontAwesome } from '@expo/vector-icons';

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

export default function SearchList(props) {

    const renderSearchBox = () => {
        let BoxArray = [];
        props.searchDataRender.map((element, index) => {
            BoxArray.push(
                <TouchableOpacity key={index} style={styles.searchBox} onPress={() => navigateToLectureScreen(element)}>
                    <HStack space="1" py="1" px="4" alignItems="center">
                        <Image source={{ uri: element.photoUrl, }} alt="User Image" style={styles.profileImage} />
                        <HStack py="1" px="1" direction='column' style={styles.stackBox}>
                            <Text pt="1" pl="2" fontFamily="body" fontWeight="400" style={styles.textSearchName} lineHeight="2xs" numberOfLines={1}>Author : {element.ownerName}</Text>
                            <Text pl="2" fontFamily="body" fontWeight="400" style={styles.textSearchTitle} numberOfLines={1}>Lecture : {element.title}</Text>
                            <Text mt="1" pl="2" fontFamily="body" fontWeight="400" style={styles.textSearchTag} lineHeight="2xs" numberOfLines={1}>Tag : {renderSearchTag(element)}</Text>
                        </HStack>
                    </HStack>
                </TouchableOpacity>
            )
        })
        return BoxArray;
    }

    const renderSearchTag = (element) => {
        let text = "";
        for (let i = 0; i < element.tag.length; i++) {
            if (i != element.tag.length - 1) {
                text += element.tag[i] + ", "
            } else {
                text += element.tag[i]
            }
        }
        return text;
    }

    const navigateToLectureScreen = (lecture) => {
        props.navigation.navigate('Lecture', { user: props.user, lecture: lecture })
    }

    return (
        <>
            {renderSearchBox()}
        </>
    );


}

const styles = StyleSheet.create({
    searchBox: {
        width: "100%",
        height: getScreenHeight() * 0.125,
        borderRadius: getScreenWidth() * 0.025,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 8,
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
    textSearchTitle: {
        fontSize: normalize(13),
        alignSelf: "flex-start",
    },
    textSearchTag: {
        fontSize: normalize(11),
        alignSelf: "flex-start",
        color: "gray"
    },
    textSearchName: {
        fontSize: normalize(13),
        alignSelf: "flex-start",
    },
    stackBox: {
        width: "85%"
    }
});
