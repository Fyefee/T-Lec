import React from 'react'
import { StyleSheet, Dimensions, PixelRatio, TouchableOpacity } from 'react-native'
import { HStack, IconButton, Icon, Text, StatusBar, Image, KeyboardAvoidingView, ScrollView
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

export default function RecentViewList(props) {

    const renderRecentViewBox = () => {
        let BoxArray = [];
        props.recentView.map((element, index) => {
            BoxArray.push(
                <TouchableOpacity key={index} onPress={() => navigateToLectureScreen(element)}>
                    <LinearGradient start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#ddeaf8', '#fff2e2']}
                        style={styles.recentViewBox}>
                        <HStack space="1" py="1" px="1" direction='column'>
                            <Image source={{ uri: element.photoUrl, }} alt="User Image" style={styles.profileRecentImage} />
                            <Text pt="1" pl="2" fontFamily="body" fontWeight="400" style={styles.textRecentHeader} numberOfLines={1}>{element.title}</Text>
                            <Text pl="2" fontFamily="body" fontWeight="300" style={styles.textRecentTag} lineHeight="2xs" numberOfLines={2}>Tag : {renderNewLecTag(element)}</Text>
                            <HStack pl="3">
                                {renderStar(element, styles.starIconRecent)}
                            </HStack>
                        </HStack>
                    </LinearGradient>
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
        <ScrollView
            _contentContainerStyle={{
                px: 3,
                py: 3
            }}
            style={styles.recentViewScroll}
            horizontal={true}
        >
            <HStack space="3" py="1">
                {renderRecentViewBox()}
            </HStack>
        </ScrollView>
    );


}

const styles = StyleSheet.create({
    recentViewScroll: {
        width: '100%',
        //height: getScreenHeight() * 0.335,
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
});
