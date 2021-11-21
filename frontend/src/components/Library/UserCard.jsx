import React from 'react'
import { StyleSheet, Dimensions, PixelRatio, TouchableOpacity } from 'react-native'
import { HStack, Text, Image, Spinner } from "native-base";
import { FontAwesome } from '@expo/vector-icons';
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

    const renderStar = () => {
        let star = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= props.userInfo.rating) {
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

    if (props.isLoad) {
        return (
            <LinearGradient start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#ffe4ca', '#90aacb']}
                style={styles.userCard}
            >
                <HStack space="0" justifyContent="space-around">
                    <HStack space="2" py="5" px="5" direction='column'>
                        <Image mt="2" source={{ uri: props.user.image }}
                            alt="UserIcon" style={styles.userImage} />
                        <Text pt="1" fontFamily="body" fontWeight="700" style={styles.cardUserName}>{props.user.firstname}{"\n"}{props.user.lastname}</Text>
                    </HStack>

                    <HStack space="4" py="9" pr="4" direction='column'>
                        {props.userInfo.rating == null ? (
                            <Text pt="1" fontFamily="body" fontWeight="700" style={styles.cardRatingText}>Never get ratings</Text>
                        ) : (
                            <Text pt="1" fontFamily="body" fontWeight="700" style={styles.cardRatingText}>Rating {props.userInfo.rating}</Text>
                        )}

                        <HStack space="1" justifyContent="center">
                            {renderStar()}
                        </HStack>
                        <HStack space="3" justifyContent="space-between">
                            <HStack space="1" direction='column'>
                                <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>Post</Text>
                                <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>{props.userInfo.postCount}</Text>
                            </HStack>
                            <HStack space="1" direction='column'>
                                <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>Follower</Text>
                                <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>{props.userInfo.userFollower}</Text>
                            </HStack>
                            <HStack space="1" direction='column'>
                                <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>Following</Text>
                                <Text fontFamily="body" fontWeight="700" style={styles.cardDetailText}>{props.userInfo.userFollowing}</Text>
                            </HStack>
                        </HStack>
                    </HStack>

                </HStack>
            </LinearGradient>
        );
    }
    else {
        return (
            <LinearGradient start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#ffe4ca', '#90aacb']}
                style={styles.userCard}
            >
                <Spinner size="lg" color="emerald" />
            </LinearGradient>
        )
    }


}

const styles = StyleSheet.create({
    userCard: {
        width: "100%",
        height: getScreenHeight() * 0.3,
        minHeight: getScreenHeight() * 0.3,
        borderRadius: getScreenWidth() * 0.03,
        justifyContent: 'center',
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
