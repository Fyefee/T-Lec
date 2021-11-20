import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity, View} from 'react-native'
import axios from 'axios';
import { API_LINK, CLIENTID } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Input, TextArea, VStack, HStack, Button, IconButton, Icon, Text,
    NativeBaseProvider, Center, Box, StatusBar, extendTheme, ScrollView,
    Image, Select, CheckIcon, Item, Modal, FormControl
} from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import NavigationBar from '../components/NavigationBar'
import { withTheme } from 'styled-components';
import { flex } from 'styled-system';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

const normalize = (size) => {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

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

export default function Ranking({ route, navigation }) {

    const { user } = route.params;

    let [ranking, setRanking] = React.useState([
        {
            "ranking": 1,
            "owner": "Jeffy",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec1",
            "downloadCount": 159,
        },
        {
            "ranking": 2,
            "owner": "Boos",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec2",
            "downloadCount": 109
        },
        {
            "ranking": 3,
            "owner": "Owner1",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec3",
            "downloadCount": 100
        },
        {
            "ranking": 4,
            "owner": "Owner2",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec4",
            "downloadCount": 92
        },
        {
            "ranking": 5,
            "owner": "Owner3",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec5",
            "downloadCount": 68
        },
        {
            "ranking": 6,
            "owner": "Owner4",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec6",
            "downloadCount": 54
        },
        {
            "ranking": 7,
            "owner": "Owner5",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec7",
            "downloadCount": 15
        },
        {
            "ranking": 8,
            "owner": "Owner6",
            "ownerImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
            "LectureName": "Lec8",
            "downloadCount": 3
        },
    ])

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

    return (
        
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#c5d8ff', '#fedcc8']} style={styles.container}>
        <NativeBaseProvider theme={theme}>
            <ScrollView style={styles.scrollView}> 
            <Text pt="20" fontFamily="body" fontWeight="700" style={styles.ranking_header}>RANKING</Text>
            <Image source={require("../assets/decoration/top_frame1.png")} style={styles.topFrame1} ></Image>
            <Image source={require("../assets/decoration/top_frame2.png")} style={styles.topFrame2} ></Image>
            <Image source={require("../assets/decoration/top_frame3.png")} style={styles.topFrame3} ></Image>
            <Image source={{ uri: ranking[0].ownerImage, }} style={styles.ownerImage1} />
            <Image source={{ uri: ranking[1].ownerImage, }} style={styles.ownerImage2} />
            <Image source={{ uri: ranking[2].ownerImage, }} style={styles.ownerImage3} />
            <Text pt="1" fontWeight="0" style={[styles.top3_name1,{fontSize: normalize(18)}]}>{ranking[0].owner}</Text>
            <Text pt="4" fontWeight="700" style={[styles.top3_name1,{fontSize: normalize(20)}]}>{ranking[0].LectureName}</Text>
            <Text pt="1"  fontWeight="0" style={[styles.top3_name2,{fontSize: normalize(18)}]}>{ranking[1].owner}</Text>
            <Text pt="3" fontWeight="700" style={[styles.top3_name2,{fontSize: normalize(20)}]}>{ranking[1].LectureName}</Text>
            <Text pt="1"  fontWeight="0" style={[styles.top3_name3,{fontSize: normalize(18)}]}>{ranking[2].owner}</Text>
            <Text pt="3" fontWeight="700" style={[styles.top3_name3,{fontSize: normalize(20)}]}>{ranking[2].LectureName}</Text>  
                <View style={styles.top10_container}>
                    <Text style={{color:'white', fontSize:19}}>{ranking[3].LectureName}</Text>
                    <Text style={{color:'white', fontSize:19}}>{ranking[3].owner}</Text>
                    <Text style={{color:'white', fontSize:19}}>4</Text>
                </View>
                <View style={styles.top10_container}></View>
                <View style={styles.top10_container}></View>
                <View style={styles.top10_container}></View>
          </ScrollView>
        </NativeBaseProvider>
        </LinearGradient>
        
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll',
    },
    scrollView: {
        width:getScreenWidth()
      },
    top10_container:{
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        width:getScreenWidth()/1.2,
        height:60,
        justifyContent: 'space-around',
        alignItems: 'center', 
        bottom: getScreenWidth() * 1.35,
        borderRadius: 20,
        left: getScreenWidth()*0.08,
        marginBottom:20,
        flexDirection: "row",
    },
    ranking_header: {
        justifyContent: 'center',
        alignItems: 'center', 
        textAlign: 'center',
        fontSize: normalize(30),
        color: "white"
    },
    ownerImage1:{
        zIndex: 3 ,
        width: getScreenWidth() * 0.38,
        height: getScreenWidth() * 0.38,
        borderRadius: getScreenWidth() * 0.36,
        bottom: getScreenWidth() * 0.59,
        left: getScreenWidth() * 0.3
    },
    ownerImage2:{
        zIndex: 1 ,
        width: getScreenWidth() * 0.38,
        height: getScreenWidth() * 0.38,
        borderRadius: getScreenWidth() * 0.36,
        bottom: getScreenWidth() * 0.87,
        left: getScreenWidth() * 0.08
    },
    ownerImage3:{
        zIndex: 1 ,
        width: getScreenWidth() * 0.38,
        height: getScreenWidth() * 0.38,
        borderRadius: getScreenWidth() * 0.36,
        bottom: getScreenWidth() * 1.24,
        left: getScreenWidth() * 0.53
    },
    top3_name1:{
        textAlign: "center",
        color: "white",
        bottom: getScreenWidth() * 1.25,
        left: 0
    },
    top3_name2:{
        textAlign: "center",
        color: "white",
        bottom: getScreenWidth() * 1.3,
        right: getScreenWidth() * 0.23
    },
    top3_name3:{
        textAlign: "center",
        color: "white",
        bottom: getScreenWidth() * 1.44,
        left: getScreenWidth() * 0.25
    },
    topFrame1:{
        position: 'absolute',
        zIndex: 4 ,
        top: getScreenWidth() * 0.21,
        width: getScreenWidth() * 0.75,
        height: getScreenWidth() * 0.75,
        right: getScreenWidth() * 0.14
    },
    topFrame2:{
        zIndex: 3 ,
        top: getScreenWidth() * 0.07,
        width: getScreenWidth() * 0.75,
        height: getScreenWidth() * 0.75,
        right: getScreenWidth() * 0.1
    },
    topFrame3:{
        position: 'absolute',
        zIndex: 3 ,
        top: getScreenWidth() * 0.32,
        width: getScreenWidth() * 0.75,
        height: getScreenWidth() * 0.75,
        left: getScreenWidth() * 0.34
    },
    
});
