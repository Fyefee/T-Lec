import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
    StyleSheet,
    Dimensions,
    PixelRatio,
    Platform,
    TouchableOpacity,
    View,
} from "react-native";
import axios from "axios";
import { API_LINK, CLIENTID, LECTURE_SERVICE_LINK } from "@env";
import { LinearGradient } from "expo-linear-gradient";
import {
    Input,
    TextArea,
    VStack,
    HStack,
    Button,
    IconButton,
    Icon,
    Text,
    NativeBaseProvider,
    Center,
    Box,
    StatusBar,
    extendTheme,
    ScrollView,
    Image,
    Select,
    CheckIcon,
    Item,
    Modal,
    FormControl,
} from "native-base";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { withTheme } from "styled-components";
import { flex, flexDirection } from "styled-system";
import LectureScreen from "./LectureScreen";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const scale = SCREEN_WIDTH / 320;

const normalize = (size) => {
    const newSize = size * scale;
    if (Platform.OS === "ios") {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
};

const getScreenWidth = () => {
    // for use screen width
    if (SCREEN_HEIGHT > SCREEN_WIDTH) {
        return SCREEN_WIDTH;
    } else {
        return SCREEN_HEIGHT;
    }
};

const getScreenHeight = () => {
    // for use screen height
    if (SCREEN_HEIGHT > SCREEN_WIDTH) {
        return SCREEN_HEIGHT;
    } else {
        return SCREEN_WIDTH;
    }
};

export default function Ranking({ route, navigation }) {
    const { user } = route.params;

    const [isLoad, setIsLoad] = React.useState(false);
    const isFocused = useIsFocused();

    useEffect(async () => {
        try {
            setIsLoad(false);

            const dataFromDB = await axios.get(`${API_LINK}/getRanking`, {
                params: { email: user.email },
            });
            // const dataFromDB = await axios.get(`${LECTURE_SERVICE_LINK}/getRanking`);
            settop10_container(dataFromDB.data);
            setIsLoad(true);
        } catch (e) {
            console.log("GetData error : ", e);
        }
    }, [isFocused]);

    let [top10_container, settop10_container] = React.useState([]);
    const top3_list = top10_container.filter((item, index) => index < 3);

    const top3 = () => {
        const top3 = [];
        top3_list.map((top, index) => {
            if (index == 0) {
                top3.push(
                    <View key={index}>
                        <Text
                            pt="4"
                            fontWeight="700"
                            style={[styles.top3_name1, { fontSize: normalize(20) }]}
                        >
                            {top.title}
                        </Text>
                        <Text
                            fontWeight="0"
                            style={[styles.top3_name1, { fontSize: normalize(1) }]}
                        >
                            {top.owner}
                        </Text>
                    </View>
                );
            } else if (index == 1) {
                top3.push(
                    <View key={index}>
                        <Text
                            pt="10"
                            fontWeight="700"
                            style={[styles.top3_name2, { fontSize: normalize(20) }]}
                        >
                            {top.title}
                        </Text>
                        <Text
                            fontWeight="0"
                            style={[styles.top3_name2, { fontSize: normalize(12) }]}
                        >
                            {top.owner}
                        </Text>
                    </View>
                );
            } else if (index == 2) {
                top3.push(
                    <View key={index}>
                        <Text
                            pt="3"
                            fontWeight="700"
                            style={[styles.top3_name3, { fontSize: normalize(20) }]}
                        >
                            {top.title}
                        </Text>
                        <Text
                            fontWeight="0"
                            style={[styles.top3_name3, { fontSize: normalize(12) }]}
                        >
                            {top.owner}
                        </Text>
                    </View>
                );
            }
        });

        return top3;
    };

    const theme = extendTheme({
        fontConfig: {
            Prompt: {
                400: {
                    normal: "Prompt-Medium",
                },
                700: {
                    normal: "Prompt-SemiBold",
                },
            },
        },

        // Make sure values below matches any of the keys in `fontConfig`
        fonts: {
            heading: "Prompt",
            body: "Prompt",
            mono: "Prompt",
        },
    });

    const navigateToLectureScreen = (lecture) => {
        navigation.navigate("Lecture", { user: user, lecture: lecture });
    };
    const changePageToRanking = () => {
        navigation.goBack();
    };
    if (isLoad) {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={["#c5d8ff", "#fedcc8"]}
                style={styles.container}
            >
                <NativeBaseProvider theme={theme}>
                    <ScrollView style={styles.scrollView}>
                        {/* <IconButton
            pt="5"
            icon={
              <Icon
                as={<FontAwesome name="arrow-circle-left" size={20} />}
                size="lg"
                style={{
                  color: "white",
                  position: "absolute",
                  top: getScreenHeight() / 20,
                  left: getScreenWidth() / 30,
                }}
              />
            }
            // icon={<FontAwesome name="arrow-circle-left" size={50} style={{color: "white"}}/>}
            onPress={() => changePageToRanking()}
          /> */}
                        <IconButton
                            _icon={{
                                as: <FontAwesome name="arrow-circle-left" size={50} style={{ color: "white" }} />,
                                name: "menu",
                            }}
                            onPress={() => changePageToRanking()}
                            zIndex={1000}
                            style={{
                                top: getScreenHeight() / 30,
                                left: getScreenWidth() / 30,
                                width: 61
                            }}
                        />

                        <Text
                            pt="10"
                            fontFamily="body"
                            fontWeight="700"
                            style={styles.ranking_header}
                        >
                            RANKING
          </Text>
                        <Image
                            source={require("../assets/decoration/top_frame1.png")}
                            alt="top_frame1"
                            style={styles.topFrame1}
                        ></Image>
                        <Image
                            source={require("../assets/decoration/top_frame2.png")}
                            alt="top_frame2"
                            style={styles.topFrame2}
                        ></Image>
                        <Image
                            source={require("../assets/decoration/top_frame3.png")}
                            alt="top_frame3"
                            style={styles.topFrame3}
                        ></Image>
                        <Image
                            source={{ uri: top10_container[0].ownerImage }}
                            style={styles.ownerImage1}
                            alt="1 Owner Image"
                        />
                        <Image
                            source={{ uri: top10_container[1].ownerImage }}
                            style={styles.ownerImage2}
                            alt="2 Owner Image"
                        />
                        <Image
                            source={{ uri: top10_container[2].ownerImage }}
                            style={styles.ownerImage3}
                            alt="3 Owner Image"
                        />
                        {top3()}

                        {top10_container.map((top, index) => (
                            <TouchableOpacity
                                style={styles.top10_container}
                                key={index}
                                onPress={() => navigateToLectureScreen(top)}
                            >
                                <View>
                                    <Text style={{ color: "white", fontSize: 19 }}>
                                        {" "}
                                        {top.title}
                                    </Text>
                                    <Text style={{ color: "white", fontSize: 19 }}>
                                        {" "}
                                        {top.owner}
                                    </Text>
                                </View>
                                <Text style={{ color: "white", fontSize: 19 }}>{index + 1} </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </NativeBaseProvider>
            </LinearGradient>
        );
    } else {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={["#c5d8ff", "#fedcc8"]}
                style={styles.container}
            >
                <NativeBaseProvider theme={theme}>
                    
                </NativeBaseProvider>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        overflow: "scroll",
    },
    scrollView: {
        width: getScreenWidth(),
    },
    top10_container: {
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        width: getScreenWidth() / 1.2,
        height: 75,
        justifyContent: "space-around",
        alignItems: "center",
        bottom: getScreenWidth() * 1.3,
        borderRadius: 40,
        left: getScreenWidth() * 0.08,
        marginBottom: 20,
        flexDirection: "row",
    },
    ranking_header: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontSize: normalize(30),
        color: "white",
    },
    ownerImage1: {
        zIndex: 3,
        width: getScreenWidth() * 0.38,
        height: getScreenWidth() * 0.38,
        borderRadius: getScreenWidth() * 0.36,
        bottom: getScreenWidth() * 0.58,
        left: getScreenWidth() * 0.3,
    },
    ownerImage2: {
        zIndex: 1,
        width: getScreenWidth() * 0.38,
        height: getScreenWidth() * 0.38,
        borderRadius: getScreenWidth() * 0.36,
        bottom: getScreenWidth() * 0.87,
        left: getScreenWidth() * 0.08,
    },
    ownerImage3: {
        zIndex: 1,
        width: getScreenWidth() * 0.38,
        height: getScreenWidth() * 0.38,
        borderRadius: getScreenWidth() * 0.36,
        bottom: getScreenHeight() * 0.74,
        left: getScreenWidth() * 0.53,
    },
    top3_name1: {
        textAlign: "center",
        color: "white",
        bottom: getScreenWidth() * 1.25,
        left: 0,
    },
    top3_name2: {
        textAlign: "center",
        color: "white",
        bottom: getScreenWidth() * 1.3,
        right: getScreenWidth() * 0.23,
    },
    top3_name3: {
        textAlign: "center",
        color: "white",
        bottom: getScreenWidth() * 1.44,
        left: getScreenWidth() * 0.25,
    },
    topFrame1: {
        position: "absolute",
        zIndex: 4,
        top: getScreenHeight() * 0.17,
        width: getScreenWidth() * 0.75,
        height: getScreenWidth() * 0.75,
        right: getScreenWidth() * 0.14,
    },
    topFrame2: {
        zIndex: 3,
        top: getScreenWidth() * 0.07,
        width: getScreenWidth() * 0.75,
        height: getScreenWidth() * 0.75,
        right: getScreenWidth() * 0.1,
    },
    topFrame3: {
        position: "absolute",
        zIndex: 3,
        top: getScreenWidth() * 0.40,
        width: getScreenWidth() * 0.75,
        height: getScreenWidth() * 0.75,
        left: getScreenWidth() * 0.34,
    },
});
