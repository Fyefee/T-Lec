import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity, View } from 'react-native'
import axios from 'axios';
import { API_LINK, CLIENTID } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Input, TextArea, VStack, HStack, Button, IconButton, Icon, Text,
    NativeBaseProvider, Center, Box, StatusBar, extendTheme, ScrollView,
    Image, Select, CheckIcon, Item, Modal, FormControl, Wrap, AlertDialog, Popover
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

    let [collection, setCollection] = React.useState([
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
            "privacy": "public",
        },
        {
            "name": "Test2",
            "privacy": "private",
        },
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
            "privacy": "public",
        },
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
            "privacy": "public",
        },
        {
            "name": "Test2",
            "privacy": "private",
        },
        {
            "name": "Test11111111111111111111111111111111111111111111111111111111",
            "privacy": "public",
        },
        {
            "name": "Test2",
            "privacy": "private",
        },
        {
            "name": "Test2",
            "privacy": "private",
        },
    ])

    const [isOpen, setIsOpen] = React.useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [deleteObject, setDeleteObject] = React.useState(null)

    const onClose = () => setIsOpen(false)

    const onPopOverOpen = () => setIsPopoverOpen(true)
    const onPopOverClose = () => setIsPopoverOpen(false)

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

    const renderCollection = () => {
        let collectionArray = [];
        collection.map((element, index) => {
            collectionArray.push(
                <Box key={index} style={styles.collectionBox} my="2">
                    <Text numberOfLines={2} pt="2" px="2">{element.name}</Text>
                    <HStack space="1" p="1" style={styles.collectionBoxStack}>
                        {element.privacy == "public" ? (
                            <Ionicons name="earth-sharp" style={styles.collectionPrivacyIcon} />
                        ) : (
                            <FontAwesome name="lock" style={styles.collectionPrivacyIcon} />
                        )}

                        <Popover
                            trigger={(triggerProps) => {
                                return (
                                    <IconButton
                                        icon={<FontAwesome name="ellipsis-v" style={styles.collectionMoreIcon} />}
                                        size="sm"
                                        borderRadius="full" {...triggerProps} />
                                )
                            }}
                        >
                            <Popover.Content w="32">
                                <Popover.Body>
                                    <Button colorScheme="danger" variant="unstyled" onPress={() => openDeleteAlert(element)}>
                                        <Text fontFamily="body" fontWeight="700">Delete</Text>
                                    </Button>
                                </Popover.Body>
                            </Popover.Content>
                        </Popover>

                    </HStack>
                </Box>
            )
        })
        return collectionArray;
    }

    const openDeleteAlert = (element) => {
        setDeleteObject(element)
        setIsOpen(!isOpen);
    }

    const deleteCollection = () => {
        let index = collection.indexOf(deleteObject);
        collection.splice(index, 1);
        onClose();
    }

    return (
        <NativeBaseProvider theme={theme}>
            <Appbar user={user} bgColor={"#fef1e6"}/>
            <ScrollView
                _contentContainerStyle={{
                    pt: 6,
                    pb: 3,
                    px: 5,
                }}
                style={styles.scrollStyle}
            >
                <HStack space="4" direction='column'>
                    <LinearGradient start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#ffe4ca', '#90aacb']}
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

                    <LinearGradient start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#c5d8ff', '#fedcc8']}
                        style={styles.collectionCard}
                    >
                        <Text pt="6" pl="5" fontFamily="body" fontWeight="700" style={styles.collectionHeader}>Collection</Text>
                        {collection.length > 3 ? (
                            <Wrap direction="row" style={styles.collectionWrap} pt="2" pb="6">
                                {renderCollection()}
                            </Wrap>
                        ) : (
                            <HStack space="5" pt="2" pb="6">
                                {renderCollection()}
                            </HStack>
                        )}
                    </LinearGradient>
                </HStack>
            </ScrollView>

            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
            >
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Delete Lecture</AlertDialog.Header>
                    <AlertDialog.Body>
                        Do you really want to delete this lecture?
                        </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="unstyled"
                                onPress={onClose}
                            >
                                Cancel
                                </Button>
                            <Button colorScheme="danger" onPress={deleteCollection}>
                                Delete
                                </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>

            <NavigationBar page={"Library"} />
        </NativeBaseProvider>
    );

}

const styles = StyleSheet.create({
    scrollStyle: {
        width: '100%',
        height: "100%",
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
    collectionCard: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: "hidden",
        borderRadius: getScreenWidth() * 0.035,
    },
    collectionHeader: {
        fontSize: normalize(20),
        alignSelf: "flex-start"
    },
    collectionWrap: {
        justifyContent: "space-evenly"
    },
    collectionBox: {
        width: '30%',
        height: getScreenHeight() * 0.15,
        borderRadius: getScreenWidth() * 0.025,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    collectionBoxStack: {
        position: "absolute",
        right: 0,
        top: 0
    },
    collectionPrivacyIcon: {
        fontSize: normalize(19),
        color: "#818181",
        paddingTop: 2
    },
    collectionMoreIcon: {
        fontSize: normalize(19),
        color: "#818181",
    },
    popOverDeleteButton: {
        width: getScreenHeight() * 0.15,
    }
});
