import React from 'react'
import { StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native'
import { HStack, IconButton, Icon, Text, StatusBar, Box } from "native-base";
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

const scale = SCREEN_WIDTH / 320;

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
            <StatusBar backgroundColor="#fedcc8" barStyle="light-content" />
            <HStack bg='#fedcc8' pl="10" pr="4" py="1" style={styles.navigationBar}>
                <HStack space="0" alignItems='center' direction='column'>
                    <IconButton icon={<Icon as={<FontAwesome name="search" size={24}/>}
                        size='md' style={[props.page == "Search" ? styles.textSelected : styles.text]}/>} />
                    <Text style={[styles.navigationBarText, props.page == "Search" ? styles.textSelected : styles.text]} fontFamily="body" fontWeight="700">Search</Text>
                </HStack>
                <HStack space="0" alignItems='center' direction='column'>
                    <IconButton icon={<Icon as={<FontAwesome name="book" size={24} />}
                        size='md' style={[props.page == "Library" ? styles.textSelected : styles.text]}/>} />
                    <Text style={[styles.navigationBarText, props.page == "Library" ? styles.textSelected : styles.text]} fontFamily="body" fontWeight="700">Your Library</Text>
                </HStack>

            </HStack>
            <Box style={styles.centerButton}>
                <HStack space="0" alignItems='center' direction='column' style={styles.centerButtonStack}>
                    <IconButton icon={<Icon as={<FontAwesome name="home" size={20} />}
                     size='lg' style={[props.page == "Home" ? styles.textSelected : styles.text]}/>}/>
                    <Text style={[styles.centerButtonText, props.page == "Home" ? styles.textSelected : styles.text]} fontFamily="body" fontWeight="700">Home</Text>
                </HStack>
            </Box>
        </>
    );


}

const styles = StyleSheet.create({
    navigationBar: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    navigationBarText: {
        paddingTop: 0,
        fontSize: normalize(13),
    },
    centerButton:{
        flex: 1,
        width: getScreenWidth() * 0.27,
        height: getScreenWidth() * 0.27,
        backgroundColor: '#ffb287',
        borderRadius: 100,
        position: 'absolute',
        alignSelf: 'center',
        bottom: getScreenWidth() * -0.06

    },
    centerButtonText:{
        marginTop: -8,
        fontSize: 17,
    },
    centerButtonStack:{
        position: 'relative',
        top: 12
    },
    text: {
        color: 'white'
    },
    textSelected: {
        color: 'black'
    }
});
