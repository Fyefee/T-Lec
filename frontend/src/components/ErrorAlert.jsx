import React from 'react'
import { StyleSheet, Dimensions, PixelRatio } from 'react-native'
import { HStack, IconButton, Icon, Text, Collapse, Alert, CloseIcon, VStack } from "native-base";
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

export default function ErrorAlert(props) {

    return (
        <>
            { (props.isAlertOpen) ? (
                <Alert w="85%" status="error" style={styles.alertStyle}>
                    <VStack space={2} flexShrink={1} w="100%">
                        <HStack flexShrink={1} space={2} justifyContent="space-between">
                            <HStack space={2} flexShrink={1}>
                                <Alert.Icon mt="1" />
                                <Text fontSize="md" color="coolGray.800">
                                    Please try again later!
                            </Text>
                            </HStack>
                            <IconButton
                                variant="unstyled"
                                icon={<CloseIcon size="3" color="coolGray.600" />}
                                onPress={() => props.setIsAlertOpen(false)}
                            />
                        </HStack>
                    </VStack>
                </Alert>
            ) : (
                <></>

            )}
        </>
    );


}

const styles = StyleSheet.create({
    alertStyle: {
        position: "absolute",
        alignSelf: "center",
        top: getScreenHeight() * 0.06,
        borderColor: "red",
        borderWidth: 2,
    },
});
