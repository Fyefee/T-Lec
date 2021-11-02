import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity, View } from 'react-native'
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
import Appbar from '../components/CreateLec/AppBar'


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

export default function CreateLec({ route, navigation }) {

    const [showModal, setShowModal] = useState(false)

    let [privacy, setPrivacy] = React.useState("")
    let [searchId, setSearchId] = React.useState("")

    let [allUserId, setAllUserId] = React.useState(null)
    let [searchUserById, setSearchUserById] = React.useState([])

    let [selectedUser, setSelectedUser] = React.useState([])

    const { user } = route.params;

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

    const openModal = async () => {
        try {
            const allId = await axios.get(`${API_LINK}/getAllUserId`)
            setAllUserId(allId.data)
        }
        catch (e) {
            console.log("GetId error : ", e)
        }
        finally {
            setShowModal(true)
        }
    }

    const searchInputHandler = (inputText) => {
        //...เพิ่มโค้ด...อัพเดทค่าสเตท enteredValue ด้วยค่า inputText ที่รับมา
        setSearchId(inputText)
    };

    const searchIdHandler = async () => {
        const userList = [];
        allUserId.forEach(element => {
            if (element.includes(searchId)) {
                userList.push(element)
            }
        })
        setSearchUserById(userList)
    }

    const renderUserSearch = () => {
        const userList = [];
        searchUserById.map(element => {
            userList.push(
                <HStack key={element} style={styles.selectAddPermissionRow} mt="2.5">
                    <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>{element}</Text>
                    <Button style={styles.selectAddPermissionButton} onPress={() =>addSelectedUser(element)}><Text style={{ color: "white" }}>Add</Text></Button>
                </HStack>
            )
        })

        return userList
    }

    const addSelectedUser = (user_email) => {
        newList = [...selectedUser]
        newList.push(user_email)
        setSelectedUser(newList)
        setShowModal(false)
        console.log(user_email)
    }

    return (
        <NativeBaseProvider theme={theme}>
            <LinearGradient start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#c5d8ff', '#fedcc8']}
                style={styles.container}>
                <Appbar />
                <ScrollView
                    _contentContainerStyle={{
                        py: 3,
                        px: 6,
                    }}
                    style={styles.scrollStyle}
                >
                    <Box>
                        <HStack space="5">
                            <Image source={{ uri: user.image, }}
                                alt="Alternate Text" style={styles.profileImage} />
                            <HStack space="0" direction='column'>
                                <Text pt="1" fontFamily="body" fontWeight="700" style={styles.profileText}>{user.firstname} {user.lastname}</Text>
                                <Select
                                    variant="styled"
                                    selectedValue={privacy}
                                    placeholder="Select privacy"
                                    onValueChange={(itemValue) => setPrivacy(itemValue)}
                                    _selectedItem={{
                                        endIcon: <CheckIcon size={4} />,
                                    }}
                                    style={styles.privacySelector}
                                    fontFamily="body" fontWeight="700"
                                >
                                    <Select.Item label="Public" value="public" />
                                    <Select.Item label="Private" value="private" />
                                </Select>
                            </HStack>
                        </HStack>

                        <HStack space="3" px="4" pt="2" pb="3" mt="4" style={styles.titleInputBox}>
                            <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Title :</Text>
                            <Input px="0" py="0" size="xl" variant="unstyled" fontFamily="body" fontWeight="400"
                                w={{
                                    base: "80%",
                                }} />
                        </HStack>

                        <HStack space="3" px="2" py="2" mt="3" style={styles.titleInputBox}>
                            <TextArea
                                h={'32'}
                                placeholder="Tell something...&#10;Example : This lecture is for sale"
                                variant="unstyled"
                                textAlignVertical="top"
                                fontSize="15"
                                w={{
                                    base: "100%",
                                }}
                            />
                        </HStack>

                        <HStack space="3" px="4" pt="2" pb="3" mt="3" style={styles.titleInputBox}>
                            <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Contact :</Text>
                            <Input px="0" py="0" size="xl" variant="unstyled" fontFamily="body" fontWeight="400"
                                w={{
                                    base: "70%",
                                }} />
                        </HStack>

                        <HStack space="3" px="4" pt="2" pb="3" mt="3" style={styles.tagInputBox}>
                            <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Tag :</Text>
                            <TouchableOpacity style={styles.addTagButton}><FontAwesome name="plus" size={22} color="white" /></TouchableOpacity>
                        </HStack>

                        <HStack space="3" px="4" pt="2" pb="3" mt="3" style={styles.tagInputBox}>
                            <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Upload File</Text>
                            <TouchableOpacity style={styles.chooseFileButton}><Text style={{ color: "white" }}>Choose File</Text></TouchableOpacity>
                        </HStack>

                        {privacy == "private" ? (
                            <HStack space="3" px="4" pt="2" pb="3" mt="3" style={styles.permissionBox}>
                                <HStack style={styles.permissionInputBox}>
                                    <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Add Permission</Text>
                                    <TouchableOpacity style={styles.chooseFileButton} onPress={openModal}>
                                        <Text style={{ color: "white" }}>Choose User</Text>
                                    </TouchableOpacity>
                                </HStack>
                            </HStack>
                        ) : (
                            <></>
                        )}


                    </Box>

                </ScrollView>

                <Modal isOpen={showModal} onClose={() => setShowModal(false)} size={"xl"}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>
                            <Text fontFamily="body" fontWeight="700" style={styles.modalHeader}>
                                Add Permission
                            </Text>
                        </Modal.Header>
                        <Modal.Body>
                            <HStack space="3" px="2" pb="3" >
                                <Input
                                    variant="underlined"
                                    placeholder="Search"
                                    width="70%"
                                    borderRadius="10"
                                    py="1"
                                    px="2"
                                    borderWidth="0"
                                    onChangeText={searchInputHandler}
                                    InputLeftElement={
                                        <Icon
                                            ml="2"
                                            size="5"
                                            color="gray.500"
                                            as={<Ionicons name="ios-search" />}
                                        />
                                    }
                                />
                                <Button style={styles.idSearchButton} onPress={searchIdHandler}><Text style={{ color: "white" }}>Search</Text></Button>
                            </HStack>
                            <ScrollView
                                persistentScrollbar={true}
                                style={styles.selectAddPermissionScrollStyle}
                            >
                                {renderUserSearch()}
                            </ScrollView>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>

                <NavigationBar page={"CreateLec"} />
            </LinearGradient>
        </NativeBaseProvider>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: "hidden"
    },
    scrollStyle: {
        width: '100%',
        marginTop: getScreenHeight() * 0.1,
        marginBottom: getScreenHeight() * 0.11,
    },
    profileImage: {
        width: getScreenWidth() * 0.16,
        height: getScreenWidth() * 0.16,
        borderRadius: getScreenWidth() * 0.16,
    },
    profileText: {
        fontSize: normalize(16)
    },
    privacySelector: {
        fontSize: normalize(13),
        backgroundColor: "#fedcc8",
    },
    titleInputBox: {
        backgroundColor: "#f7f1ed",
        borderRadius: 5,
        width: '100%',
        opacity: 0.9
    },
    inputText: {
        fontSize: normalize(16)
    },
    tagInputBox: {
        backgroundColor: "#f7f1ed",
        borderRadius: 5,
        width: '100%',
        justifyContent: "space-between",
        opacity: 0.9
    },
    addTagButton: {
        width: 30,
        height: 30,
        borderRadius: 25,
        backgroundColor: "#ffb287",
        justifyContent: "center",
        alignItems: "center",
    },
    chooseFileButton: {
        width: 100,
        height: 30,
        borderRadius: 10,
        backgroundColor: "#ffb287",
        justifyContent: "center",
        alignItems: "center",
    },
    permissionBox: {
        backgroundColor: "#f7f1ed",
        borderRadius: 5,
        width: '100%',
        opacity: 0.9,
        flexDirection: "row"
    },
    permissionInputBox: {
        justifyContent: "space-between",
        width: "100%"
    },
    modalHeader: {
        fontSize: normalize(15)
    },
    idSearchButton: {
        width: 80,
        height: 30,
        borderRadius: 10,
        backgroundColor: "#ffb287",
        justifyContent: "center",
        alignItems: "center",
    },
    selectAddPermissionRow: {
        justifyContent: "space-around",
    },
    selectAddPermissionButton: {
        width: 60,
        height: 30,
        borderRadius: 10,
        backgroundColor: "#ffb287",
        justifyContent: "center",
        alignItems: "center",
    },
    selectAddPermissionScrollStyle: {
        width: '100%',
        marginBottom: getScreenHeight() * 0.035,
        height: getScreenHeight() * 0.25,
    }
});
