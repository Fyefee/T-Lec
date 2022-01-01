import React from 'react'
import { StyleSheet, Dimensions, PixelRatio } from 'react-native'
import { HStack, IconButton, Icon, Text, StatusBar, Image, Popover, Button, Badge, VStack, Pressable } from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { API_LINK, CLIENTID, USER_SERVICE_LINK } from '@env';
import axios from 'axios';

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

export default function AppBar(props) {

    const renderNotification = () => {
        const notificationList = [];
        props.notification.map((element, index) => {
            notificationList.push(
                <HStack key={index} px="1" mt="1.5" style={styles.notificationList}>
                    <HStack direction='column' width="90%">
                        <Text fontFamily="body" fontWeight="700" numberOfLines={1} style={styles.notificationText}>{element.ownerName}</Text>
                        <Text fontFamily="body" fontWeight="700" numberOfLines={1} style={styles.notificationText}>CreatePost : {element.lectureTitle}</Text>
                    </HStack>
                    <IconButton
                        icon={<FontAwesome name="close" />}
                        size="md"
                        borderRadius="full"
                        mr="1"
                        onPress={() => deleteNotification(element)} />
                </HStack>
            )
        })
        return notificationList
    }

    const changePageToRanking = () => {
        props.navigation.navigate('Ranking', { user: props.user })
    }

    const deleteNotification = async (element) => {
        try {
            await axios.delete(`${API_LINK}/deleteNotification`, { params: { user: props.user, notification: element } })
            // await axios.post(`${USER_SERVICE_LINK}/deleteNotification`, { email: props.user.email, notification: element })
            let notificationArray = [...props.notification];
            const index = notificationArray.indexOf(element)
            notificationArray.splice(index, 1)
            props.setNotification(notificationArray)

        } catch (err) {
            console.log(err)
        }
    }

    const logout = async () => {
        try {
            await axios.get(`${API_LINK}/logout`)
            props.navigation.navigate('Login')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <StatusBar backgroundColor={props.bgColor} barStyle="light-content" />

            <HStack bg={props.bgColor} px="4" py="1" style={styles.appbar}>
                <HStack space="2" alignItems='center'>
                    <Image alt="logo" style={styles.logoImage} source={require("../../assets/logo/logo_color_dino.png")}></Image>
                    <Text style={styles.appbarText} mt="3" fontFamily="body" fontWeight="700">T-Lec</Text>
                </HStack>

                <HStack space="1" alignItems='center'>
                    <IconButton
                        icon={<Ionicons name="trophy" style={styles.icon} />}
                        size="md"
                        mt="1"
                        borderRadius="full"
                        onPress={() => changePageToRanking()} />


                    <Popover
                        placement="bottom right"
                        trigger={(triggerProps) => {
                            return (
                                <VStack>
                                    {props.notification.length > 0 ? (
                                        <Badge
                                            colorScheme="danger" rounded="999px"
                                            zIndex={1} variant="solid" alignSelf="flex-end"
                                            _text={{
                                                fontSize: 12,
                                            }}
                                            style={styles.notificationBadge}
                                        >
                                            {props.notification.length}
                                        </Badge>
                                    ) : (
                                        <></>
                                    )}
                                    <IconButton
                                        icon={<FontAwesome name="bell" style={styles.icon} />}
                                        size="md"
                                        mr="2"
                                        mt="1"
                                        borderRadius="full"
                                        {...triggerProps} />
                                </VStack>
                            )
                        }}
                    >
                        <Popover.Content w="64">
                            <Popover.Body>
                                <HStack space="1" direction='column'>
                                    {renderNotification()}
                                </HStack>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover>

                    <Popover
                        placement="bottom right"
                        trigger={(triggerProps) => {
                            return (
                                <Pressable {...triggerProps}>
                                    <Image mt="2" source={{ uri: props.user.image }}
                                        alt="UserIcon" style={styles.commentImage} />
                                </Pressable>
                            )
                        }}
                    >
                        <Popover.Content w="32">
                            <Popover.Body>
                                <Button colorScheme="danger" variant="unstyled" onPress={() => logout()}>
                                    <Text fontFamily="body" fontWeight="700">Logout</Text>
                                </Button>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover>
                </HStack>

            </HStack>
        </>
    );


}

const styles = StyleSheet.create({
    appbar: {
        position: 'absolute',
        width: '100%',
        top: 0,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    appbarText: {
        color: "#ffb085",
        paddingTop: 15,
        fontSize: normalize(24),
    },
    logoImage: {
        width: getScreenWidth() * 0.15,
        height: getScreenWidth() * 0.15,
    },
    commentImage: {
        width: getScreenWidth() * 0.1,
        height: getScreenWidth() * 0.1,
        borderRadius: getScreenWidth() * 0.16,
    },
    icon: {
        fontSize: normalize(23),
        color: "black"
    },
    notificationList: {
        justifyContent: "space-between",
        width: "100%"
    },
    notificationText: {
        fontSize: normalize(12),
    },
    notificationBadge: {
        position: "absolute"
    },
});
