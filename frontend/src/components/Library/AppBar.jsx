import React from 'react'
import { StyleSheet, Dimensions, PixelRatio } from 'react-native'
import { HStack, IconButton, Icon, Text, StatusBar, Image } from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';

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
                        borderRadius="full" />
                    <IconButton
                        icon={<FontAwesome name="bell" style={styles.icon} />}
                        size="md"
                        mr="2"
                        mt="1"
                        borderRadius="full" />
                    <Image mt="2" source={{ uri: props.user.image }}
                        alt="UserIcon" style={styles.commentImage} />
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
});
