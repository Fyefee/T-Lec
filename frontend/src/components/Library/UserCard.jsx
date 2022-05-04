import React from 'react'
import { StyleSheet, Dimensions, PixelRatio } from 'react-native'
import { HStack, Text, Image, Spinner, Button, Icon } from "native-base";
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { API_LINK } from '@env';

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

    const followUser = async () => {
        try {
            const data = {
                authId: props.user.authId,
                followEmail: props.userInfo.userEmail
            }

            await axios.put(`${API_LINK}/user/followuser`, data);
            props.increaseFollower()
            props.setIsFollow(!props.isFollow)
        } catch (err) {
            console.log(err)
        }
    }

    const unFollowUser = async () => {
        try {
            const data = {
                authId: props.user.authId,
                unfollowEmail: props.userInfo.userEmail
            }

            console.log(data)
            await axios.put(`${API_LINK}/user/unfollowuser`, data);
            props.decreaseFollower()
            props.setIsFollow(!props.isFollow)
        } catch (err) {
            console.log(err)
        }
    }

    if (props.isLoad) {
        return (
            <LinearGradient start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#ffe4ca', '#90aacb']}
                style={[props.userInfo.userEmail == props.user.email ? styles.userCard : styles.otherUserCard]}
            >
                <HStack space="0" justifyContent="space-around" alignItems="center">
                    <HStack space="1" px="5" direction='column'>
                        <Image mt="2" source={{ uri: props.userInfo.userImage }}
                            alt="UserIcon" style={styles.userImage} />
                        <Text pt="1" fontFamily="body" fontWeight="700" style={styles.cardUserName}>{props.userInfo.userFirstName}{"\n"}{props.userInfo.userLastName}</Text>
                        {props.userInfo.userEmail != props.user.email ? (
                            <>
                                {!props.isFollow ? (
                                    <Button
                                        leftIcon={<Icon as={FontAwesome} name="plus" size="sm" />}
                                        size="xs"
                                        onPress={() => followUser()}
                                    >
                                        <Text pt="1" fontFamily="body" fontWeight="700" style={styles.followButtonText}>FOLLOW</Text>
                                    </Button>
                                ) : (
                                    <Button
                                        leftIcon={<Icon as={FontAwesome} name="minus" size="sm" />}
                                        style={styles.unfollowButton}
                                        size="xs"
                                        onPress={() => unFollowUser()}
                                    >
                                        <Text pt="1" fontFamily="body" fontWeight="700" style={styles.followButtonText}>UNFOLLOW</Text>
                                    </Button>
                                )}
                            </>
                        ) : (
                            <></>
                        )}

                    </HStack>

                    <HStack space="4" pr="4" direction='column' alignItems="center">
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
    otherUserCard: {
        width: "100%",
        height: getScreenHeight() * 0.35,
        minHeight: getScreenHeight() * 0.35,
        borderRadius: getScreenWidth() * 0.03,
        justifyContent: 'center',
    },
    userImage: {
        width: getScreenWidth() * 0.25,
        height: getScreenWidth() * 0.25,
        borderRadius: getScreenWidth() * 0.25 / 2,
        alignSelf: "center"
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
    followButtonText: {
        fontSize: normalize(14),
        textAlign: "center",
        color: "white"
    },
    unfollowButton: {
        backgroundColor: "salmon"
    }
});
