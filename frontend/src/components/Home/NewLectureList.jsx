import React from 'react'
import { StyleSheet, Dimensions, PixelRatio, TouchableOpacity } from 'react-native'
import {
    HStack, IconButton, Icon, Text, StatusBar, Image, KeyboardAvoidingView, ScrollView
} from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function NewLectureList(props) {

    const renderNewLecBox = () => {
        let BoxArray = [];
        props.newLec.map((element, index) => {
            BoxArray.push(
                <TouchableOpacity key={index} style={styles.newLecBox} onPress={() => navigateToLectureScreen(element)}>
                    <HStack space="1" py="1" px="4" alignItems="center">
                        <Image source={{ uri: element.photoUrl, }} alt="User Image" style={styles.profileImage} />
                        <HStack py="1" px="1" direction='column'>
                            <Text pt="1" pl="2" fontFamily="body" fontWeight="400" style={styles.textNewLecHeader} numberOfLines={1}>{element.title}</Text>
                            <Text pl="2" fontFamily="body" fontWeight="300" style={styles.textNewLecTag} lineHeight="2xs" numberOfLines={1}>Tag : {renderNewLecTag(element)}</Text>
                            <Text pt="1" pl="2" fontFamily="body" fontWeight="300" style={styles.textNewLecDescription} lineHeight="2xs" numberOfLines={2}>{element.lecDescription}</Text>
                            <HStack px="1">
                                {renderStar(element, styles.starIconNewLec)}
                            </HStack>
                        </HStack>
                    </HStack>
                </TouchableOpacity>
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

    const navigateToLectureScreen = (lecture) => {
        props.navigation.navigate('Lecture', { user: props.user, lecture: lecture })
    }

    return (
        <>
            {renderNewLecBox()}
        </>
    );


}

const styles = StyleSheet.create({
    newLecBox: {
        width: "100%",
        height: getScreenHeight() * 0.175,
        borderRadius: getScreenWidth() * 0.025,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 8,
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
