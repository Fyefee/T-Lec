import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity } from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import axios from 'axios';
import { API_LINK, CLIENTID, USER_SERVICE_LINK, LECTURE_SERVICE_LINK, TAG_SERVICE_LINK, UPLOAD_API, S3_LINK } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Input, TextArea, HStack, Button, Icon, Text,
    NativeBaseProvider, Box, extendTheme, ScrollView,
    Image, Select, CheckIcon, Modal, Spinner
} from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Buffer } from 'buffer'

import NavigationBar from '../components/NavigationBar'
import Appbar from '../components/CreateLec/AppBar'

import * as FileSystem from 'expo-file-system';

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

export default function CreateLec({ route, navigation }) {

    const [showModal, setShowModal] = useState(false)
    const [showTagModal, setShowTagModal] = useState(false)

    let [title, setTitle] = React.useState("")
    let [description, setDescription] = React.useState("")
    let [contact, setContact] = React.useState("")

    let [isValidateTitle, setIsValidateTitle] = React.useState(true)
    let [isValidatePrivacy, setIsValidatePrivacy] = React.useState(true)
    let [isValidateUploadFile, setIsValidateUploadFile] = React.useState(true)

    let [isValidateTitleDuplicate, setIsValidateTitleDuplicate] = React.useState(true)

    let [privacy, setPrivacy] = React.useState("")
    let [searchId, setSearchId] = React.useState("")
    let [fileUploaded, setFileUploaded] = React.useState([])

    let [allUserId, setAllUserId] = React.useState(null)
    let [searchUserById, setSearchUserById] = React.useState([])

    let [selectedUser, setSelectedUser] = React.useState([])

    let [tag, setTag] = React.useState([])
    let [oldTag, setOldTag] = React.useState([])
    let [newTag, setNewTag] = React.useState([])
    let [searchTag, setSearchTag] = React.useState("")
    let [haveTagInDB, setHaveTagInDB] = React.useState([])
    let [selectedTag, setSelectedTag] = React.useState([])

    const [isLoad, setIsLoad] = React.useState(false)
    const isFocused = useIsFocused();

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

    useEffect(async () => {

        try {
            if (route.params.title == "Create Post") {

                setPrivacy("")
                setTitle("")
                setDescription("")
                setContact("")
                setOldTag([])
                setNewTag([])
                setSelectedTag([])
                setSelectedUser([])
                setFileUploaded([])

                setIsLoad(true)

            } else {
                setIsLoad(false)

                setPrivacy(route.params.lecture.privacy)
                setTitle(route.params.lecture.title)
                setDescription(route.params.lecture.description)
                setContact(route.params.lecture.contact)
                setOldTag(route.params.lecture.tag)
                setSelectedTag(route.params.lecture.tag)
                setSelectedUser(route.params.lecture.permission)

                setIsLoad(true)
            }
        }
        catch (e) {
            console.log("GetData error : ", e)
        }

    }, [isFocused])

    const openModal = async () => {
        try {
            const allId = await axios.get(`${API_LINK}/getalluseremail`)
            setAllUserId(allId.data)
        }
        catch (e) {
            console.log("GetId error : ", e)
        }
        finally {
            setShowModal(true)
        }
    }

    const openTagModal = async () => {
        try {
            const tagFromDB = await axios.get(`${API_LINK}/getalltagdata`)
            setTag(tagFromDB.data)
        }
        catch (e) {
            console.log("GetTag error : ", e)
        }
        finally {
            setShowTagModal(true)
        }
    }

    const searchInputHandler = (inputText) => {
        //...เพิ่มโค้ด...อัพเดทค่าสเตท enteredValue ด้วยค่า inputText ที่รับมา
        setSearchId(inputText)
    };

    const searchTagInputHandler = (inputText) => {
        let newArray = []
        tag.map(element => {
            if (element.tagName.toLowerCase().includes(inputText.toLowerCase()) && inputText != "") {
                newArray.push(element)
            }
        })
        setHaveTagInDB(newArray)
        setSearchTag(inputText)
    };

    const privacyInputHandler = (inputText) => {
        setIsValidatePrivacy(true)
        setPrivacy(inputText)
    };

    const titleInputHandler = (inputText) => {
        if (inputText.length >= 3) {
            setIsValidateTitle(true)
        }
        setTitle(inputText)
    };

    const searchIdHandler = async () => {
        const userList = [];
        allUserId.forEach(element => {
            if (element.includes(searchId) && element != user.email) {
                userList.push(element)
            }
        })
        setSearchUserById(userList)
    }

    const renderUserSearch = () => {
        const userList = [];
        searchUserById.map(element => {
            if (!selectedUser.includes(element)) {
                userList.push(
                    <HStack key={element} style={styles.selectAddPermissionRow} mt="2.5">
                        <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>{element}</Text>
                        <Button style={styles.selectAddPermissionButton} onPress={() => addSelectedUser(element)}><Text style={{ color: "white" }}>Add</Text></Button>
                    </HStack>
                )
            }
        })

        return userList
    }

    const renderSelectedUserPermission = () => {
        const userList = [];
        selectedUser.map(element => {
            userList.push(
                <HStack key={element} style={styles.selectAddPermissionRow} mt="1.5">
                    <Text fontFamily="body" fontWeight="700" mt="2" style={styles.permissionText}>{element}</Text>
                    <Button style={styles.selectDeletePermissionButton} colorScheme="danger" size="sm" onPress={() => deleteSelectedUser(element)}><Text style={{ color: "white" }}>Delete</Text></Button>
                </HStack>
            )
        })
        return userList
    }

    const renderFileUpload = () => {
        const fileList = [];
        fileUploaded.map(element => {
            fileList.push(
                <HStack key={element} style={styles.selectAddPermissionRow} mt="2.5">
                    <Text fontFamily="body" fontWeight="700" mt="2" style={styles.fileText}>{element.name}</Text>
                    <Button style={styles.selectDeletePermissionButton} colorScheme="danger" onPress={() => setFileUploaded([])}><Text style={{ color: "white" }}>Delete</Text></Button>
                </HStack>
            )
        })
        return fileList
    }

    const renderTagSearch = () => {
        const tagList = [];
        haveTagInDB.map(element => {
            if (!selectedTag.includes(element.tagName)) {
                tagList.push(
                    <TouchableOpacity key={element.tagName} style={styles.tagSelectButton} onPress={() => addSelectedOldTag(element.tagName)}>
                        <HStack style={styles.selectAddPermissionRow} mt="2.5" justifyContent="space-around">
                            <Text fontFamily="body" fontWeight="700" my="1" pl="3" style={styles.fileText}># {element.tagName}</Text>
                            <Text fontFamily="body" fontWeight="700" my="1" pl="3" style={styles.fileTextPost}>{element.count} Post</Text>
                        </HStack>
                    </TouchableOpacity>
                )
            }
        })
        return tagList
    }

    const renderNewTagSearch = () => {
        let isDuplicate = false;
        tag.map(element => {
            if (element.tagName == searchTag) {
                isDuplicate = true;
            }
        })
        if (!isDuplicate && !selectedTag.includes(searchTag)) {
            return <TouchableOpacity style={styles.tagSelectButton} onPress={() => addSelectedNewTag(searchTag)}>
                <HStack style={styles.selectAddPermissionRow} mt="2.5" justifyContent="space-around">
                    <Text fontFamily="body" fontWeight="700" my="1" pl="3" style={styles.fileText}># {searchTag}</Text>
                    <Text fontFamily="body" fontWeight="700" my="1" pl="3" style={styles.fileTextPost}>New Post</Text>
                </HStack>
            </TouchableOpacity>
        }
    }

    const renderSelectedTag = () => {
        const tagList = [];
        selectedTag.map(element => {
            tagList.push(
                <HStack key={element} style={styles.selectAddPermissionRow} mt="1.5">
                    <Text fontFamily="body" fontWeight="700" mt="2" style={styles.tagText}># {element}</Text>
                    <Button style={styles.selectDeleteTagButton} size="xs" colorScheme="danger" onPress={() => deleteSelectedTag(element)}><Text style={{ color: "white" }}>Delete</Text></Button>
                </HStack>
            )
        })
        return tagList
    }

    const addSelectedUser = (user_email) => {
        const newList = [...selectedUser]
        newList.push(user_email)
        setSearchUserById([])
        setSelectedUser(newList)
        setShowModal(false)
    }

    const deleteSelectedUser = (user_email) => {
        const newList = [...selectedUser]
        const emailIndex = newList.indexOf(user_email)
        if (emailIndex > -1) {
            newList.splice(emailIndex, 1);
        }
        setSelectedUser(newList)
    }

    const addSelectedNewTag = (tagName) => {
        const newList = [...selectedTag];
        newList.push(tagName);
        const newTagArray = [...newTag];
        newTagArray.push(tagName)
        setSearchTag("");
        setHaveTagInDB([]);
        setSelectedTag(newList);
        setNewTag(newTagArray)
        setShowTagModal(false);
    }

    const addSelectedOldTag = (tagName) => {
        const newList = [...selectedTag];
        newList.push(tagName);
        const oldTagArray = [...oldTag];
        oldTagArray.push(tagName)
        setSearchTag("");
        setHaveTagInDB([]);
        setSelectedTag(newList);
        setOldTag(oldTagArray)
        setShowTagModal(false);
    }

    const deleteSelectedTag = (tagName) => {
        const newSelectedTagArray = [...selectedTag]
        const newOldTagArray = [...oldTag]
        const newNewTagArray = [...newTag]
        const tagIndex = newSelectedTagArray.indexOf(tagName)
        const oldTagIndex = newOldTagArray.indexOf(tagName)
        const newTagIndex = newNewTagArray.indexOf(tagName)
        if (tagIndex > -1) {
            newSelectedTagArray.splice(tagIndex, 1);
        }
        if (oldTagIndex > -1) {
            newOldTagArray.splice(oldTagIndex, 1);
        }
        if (newTagIndex > -1) {
            newNewTagArray.splice(newTagIndex, 1);
        }
        setSelectedTag(newSelectedTagArray)
        setOldTag(newOldTagArray)
        setNewTag(newNewTagArray)
    }

    const uploadFile = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({});
            if (result.type == "cancel") {
                console.log("Upload Cancel")
            } else if (result.type == "success") {
                if (fileUploaded.length == 0) {
                    const newArray = [...fileUploaded];
                    newArray.push(result)
                    setFileUploaded(newArray)
                    setIsValidateUploadFile(true);
                }
            }
        } catch (e) {
            console.log("Upload file error");
        }
    }

    const saveLec = async () => {
        if (validateForm()) {

            try {
                const fileName = fileUploaded[0].name.slice(0, fileUploaded[0].name.length - 4)
                const res = await axios.post(`${UPLOAD_API}/upload`, { name: fileName });

                const uploadUrl = res.data.url

                const fileBase64 = await FileSystem.readAsStringAsync(fileUploaded[0].uri, { encoding: 'base64' });
                const newBuffer = fileBase64.replace(/^data:.+;base64,/, "")
                var buf = Buffer.from(newBuffer, 'base64')

                const res2 = await axios.put(uploadUrl, buf, {
                    headers: {
                        "Content-Type": "application/pdf",
                    }
                });
                if (res2.status === 200) {
                    const fileUrl = S3_LINK + res.data.Key

                    const data = {
                        title: title,
                        description: description,
                        contact: contact,
                        tag: newTag.concat(oldTag),
                        privacy: privacy,
                        owner: user.email,
                        userPermission: selectedUser,
                        fileUrl: fileUrl
                    }

                    const res3 = await axios.post(`${API_LINK}/posts`, data);
                    if (res3.status === 200) {
                        navigation.navigate('Home', { user: user })
                    } else {
                        console.log("Create Post Fail")
                    }
                }

            } catch (err) {
                console.log(err)
            }

        }
    }

    const editLec = async () => {
        if (validateEditForm()) {

            try {
                const data = {
                    postID: route.params.lecture.postID,
                    title: title,
                    description: description,
                    contact: contact,
                    tag: newTag.concat(oldTag),
                    userPermission: selectedUser,
                    privacy: privacy
                }

                const res3 = await axios.put(`${API_LINK}/posts`, data);

                const lec = {
                    postID: route.params.lecture.postID
                }

                navigation.navigate('Lecture', { user: user, lecture: lec })

            } catch (err) {
                console.log(err)
            }

        }
    }

    const validateForm = () => {

        let isValidate = true;

        if (title.length < 3) {
            setIsValidateTitle(false);
            isValidate = false;
        }

        if (privacy == "") {
            setIsValidatePrivacy(false);
            isValidate = false;
        }

        if (fileUploaded.length == 0) {
            setIsValidateUploadFile(false);
            isValidate = false;
        }

        return isValidate;
    }

    const validateEditForm = () => {

        let isValidate = true;

        if (title.length < 3) {
            setIsValidateTitle(false);
            isValidate = false;
        }

        if (privacy == "") {
            setIsValidatePrivacy(false);
            isValidate = false;
        }

        return isValidate;
    }

    if (isLoad) {
        return (
            <NativeBaseProvider theme={theme}>
                <LinearGradient start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#c5d8ff', '#fedcc8']}
                    style={styles.container}>
                    <Appbar title={route.params.title} />
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
                                        onValueChange={privacyInputHandler}
                                        _selectedItem={{
                                            endIcon: <CheckIcon size={4} />
                                        }}
                                        style={styles.privacySelector}
                                        fontFamily="body" fontWeight="700"
                                    >
                                        <Select.Item label="Public" value="public" />
                                        <Select.Item label="Private" value="private" />
                                    </Select>
                                    {!isValidatePrivacy ? (
                                        <Text fontFamily="body" fontWeight="700" mt="1" style={styles.failValidateText}>Please select privacy</Text>
                                    ) : (
                                        <></>
                                    )}
                                </HStack>
                            </HStack>

                            <HStack space="3" px="4" pt="2" pb="3" mt="4" style={styles.titleInputBox}>
                                <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Title :</Text>
                                <Input px="0" py="0" size="xl" variant="unstyled" fontFamily="body" fontWeight="400"
                                    onChangeText={titleInputHandler}
                                    value={title}
                                    w={{
                                        base: "80%",
                                    }} />
                            </HStack>
                            {!isValidateTitle ? (
                                <Text fontFamily="body" fontWeight="700" mt="1" pl="4" style={styles.failValidateText}>Title must be more than 3 characters</Text>
                            ) : (
                                <></>
                            )}

                            {!isValidateTitleDuplicate ? (
                                <Text fontFamily="body" fontWeight="700" mt="1" pl="4" style={styles.failValidateText}>Your title is duplicateed.</Text>
                            ) : (
                                <></>
                            )}

                            <HStack space="3" px="2" py="2" mt="3" style={styles.titleInputBox}>
                                <TextArea
                                    h={'32'}
                                    placeholder="Tell something...&#10;Example : This lecture is for sale"
                                    variant="unstyled"
                                    textAlignVertical="top"
                                    fontSize="15"
                                    onChangeText={(inputText) => setDescription(inputText)}
                                    value={description}
                                    w={{
                                        base: "100%",
                                    }}
                                />
                            </HStack>

                            <HStack space="3" px="4" pt="2" pb="3" mt="3" style={styles.titleInputBox}>
                                <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Contact :</Text>
                                <Input px="0" py="0" size="xl" variant="unstyled" fontFamily="body" fontWeight="400"
                                    onChangeText={(inputText) => setContact(inputText)}
                                    value={contact}
                                    w={{
                                        base: "70%",
                                    }} />
                            </HStack>

                            <HStack space="3" px="4" pt="2" mt="3" style={styles.tagInputBox} direction='column'>
                                <HStack style={styles.uploadFileInputBox}>
                                    <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Tag</Text>
                                    <TouchableOpacity style={styles.addTagButton} onPress={() => openTagModal()}><FontAwesome name="plus" size={22} color="white" /></TouchableOpacity>
                                </HStack>
                                {selectedTag.length > 0 ? (
                                    <ScrollView
                                        persistentScrollbar={true}
                                        style={styles.selectFileScrollStyle}
                                        nestedScrollEnabled={true}
                                    >
                                        {renderSelectedTag()}

                                    </ScrollView>
                                ) : (
                                    <></>
                                )}
                            </HStack>

                            {route.params.title == "Create Post" ? (
                                <HStack space="3" px="4" pt="2" pb="1" mt="3" style={styles.tagInputBox} direction='column'>
                                    <HStack style={styles.uploadFileInputBox}>
                                        <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Upload File</Text>
                                        {fileUploaded.length == 0 ? (
                                            <TouchableOpacity style={styles.chooseFileButton} onPress={() => uploadFile()}><Text style={{ color: "white" }}>Choose File</Text></TouchableOpacity>
                                        ) : (
                                            <></>
                                        )}

                                    </HStack>
                                    {fileUploaded.length > 0 ? (
                                        <ScrollView
                                            persistentScrollbar={true}
                                            style={styles.selectFileScrollStyle}
                                            nestedScrollEnabled={true}
                                        >
                                            {renderFileUpload()}

                                        </ScrollView>
                                    ) : (
                                        <></>
                                    )}
                                </HStack>
                            ) : (
                                <></>
                            )}

                            {!isValidateUploadFile ? (
                                <Text fontFamily="body" fontWeight="700" mt="1" pl="4" style={styles.failValidateText}>Please select file</Text>
                            ) : (
                                <></>
                            )}

                            {privacy == "private" ? (
                                <HStack space="3" px="4" pt="2" pb="1" mt="3" style={styles.permissionBox} direction='column'>
                                    <HStack style={styles.permissionInputBox}>
                                        <Text fontFamily="body" fontWeight="700" mt="2" style={styles.inputText}>Add Permission</Text>
                                        <TouchableOpacity style={styles.chooseFileButton} onPress={openModal}>
                                            <Text style={{ color: "white" }}>Choose User</Text>
                                        </TouchableOpacity>
                                    </HStack>

                                    {selectedUser.length > 0 ? (
                                        <ScrollView
                                            persistentScrollbar={true}
                                            style={styles.permissionScrollStyle}
                                            nestedScrollEnabled={true}
                                        >
                                            {renderSelectedUserPermission()}

                                        </ScrollView>
                                    ) : (
                                        <></>
                                    )}


                                </HStack>
                            ) : (
                                <></>
                            )}

                            <HStack space="3" pt="1" pb="1" mt="2" mb="3" style={styles.saveBox}>
                                {route.params.title == "Create Post" ? (
                                    <Button style={styles.saveButton} onPress={() => saveLec()} pt="3" endIcon={
                                        <Icon as={Ionicons} name="save" size="sm" mb="2" />}
                                    >
                                        <Text style={styles.saveText}>Save</Text>
                                    </Button>
                                ) : (
                                    <Button style={styles.saveButton} onPress={() => editLec()} pt="3" endIcon={
                                        <Icon as={FontAwesome} name="wrench" size="sm" mb="2" />}
                                    >
                                        <Text style={styles.saveText}>Edit</Text>
                                    </Button>
                                )}

                            </HStack>

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
                                    <Button style={styles.idSearchButton} size="xs" onPress={searchIdHandler}><Text style={{ color: "white" }}>Search</Text></Button>
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

                    <Modal isOpen={showTagModal} onClose={() => setShowTagModal(false)} size={"md"}>
                        <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>
                                <Text fontFamily="body" fontWeight="700" style={styles.modalHeader}>
                                    Select Tag
                            </Text>
                            </Modal.Header>
                            <Modal.Body>
                                <Input
                                    variant="underlined"
                                    placeholder="Search"
                                    width="100%"
                                    borderRadius="10"
                                    py="1"
                                    px="2"
                                    borderWidth="0"
                                    onChangeText={searchTagInputHandler}
                                    InputLeftElement={
                                        <Icon
                                            ml="2"
                                            size="5"
                                            color="gray.500"
                                            as={<Ionicons name="ios-search" />}
                                        />
                                    }
                                />
                                {searchTag.length > 0 ? (
                                    <ScrollView
                                        persistentScrollbar={true}
                                        style={styles.selectTagScrollStyle}
                                        mt="1"
                                    >
                                        {renderNewTagSearch()}
                                        {renderTagSearch()}
                                    </ScrollView>
                                ) : (
                                    <></>
                                )}
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>

                    <NavigationBar navigation={navigation} page={"CreateLec"} user={user} />
                </LinearGradient>
            </NativeBaseProvider>
        );
    } else {
        return (
            <NativeBaseProvider theme={theme}>
                <LinearGradient start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#c5d8ff', '#fedcc8']}
                    style={styles.container}>
                    <Box style={styles.blankStyle}>
                        <Spinner size="lg" color="warning" />
                    </Box>
                </LinearGradient>
            </NativeBaseProvider>
        )
    }

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
        marginTop: getScreenHeight() * 0.12,
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
        fontSize: normalize(16),
    },
    permissionText: {
        fontSize: normalize(14),
    },
    fileText: {
        width: "65%",
        fontSize: normalize(14),
    },
    fileTextPost: {
        width: "30%",
        fontSize: normalize(12),
    },
    tagText: {
        fontSize: normalize(14),
        width: "70%"
    },
    saveText: {
        fontSize: normalize(16),
        color: "white",
    },
    failValidateText: {
        color: "red",
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
        flex: 1
    },
    permissionInputBox: {
        justifyContent: "space-between",
        width: "100%"
    },
    uploadFileInputBox: {
        justifyContent: "space-between",
        width: "100%"
    },
    saveBox: {
        justifyContent: "center",
        width: "100%"
    },
    modalHeader: {
        fontSize: normalize(15)
    },
    idSearchButton: {
        borderRadius: 10,
        backgroundColor: "#ffb287",
        justifyContent: "center",
        alignItems: "center",
    },
    selectAddPermissionRow: {
        justifyContent: "space-around",
        color: "black"
    },
    selectAddPermissionButton: {
        borderRadius: 10,
        backgroundColor: "#ffb287",
        justifyContent: "center",
        alignItems: "center",
    },
    selectDeletePermissionButton: {
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    selectDeleteTagButton: {
        width: "25%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    saveButton: {
        width: "50%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffb287",
    },
    selectAddPermissionScrollStyle: {
        width: '100%',
        marginBottom: getScreenHeight() * 0.015,
        maxHeight: getScreenHeight() * 0.25,
    },
    permissionScrollStyle: {
        width: '100%',
        marginBottom: getScreenHeight() * 0.015,
        maxHeight: getScreenHeight() * 0.25,
    },
    selectFileScrollStyle: {
        width: '100%',
        marginBottom: getScreenHeight() * 0.015,
        maxHeight: getScreenHeight() * 0.25,
    },
    selectTagScrollStyle: {
        width: '100%',
        marginTop: getScreenHeight() * 0.01,
        marginBottom: getScreenHeight() * 0.01,
        maxHeight: getScreenHeight() * 0.25,
    },
    tagSelectButton: {
        backgroundColor: "#E8E8E8",
        margin: 2,
    },
    blankStyle: {
        minHeight: getScreenHeight() * 0.3,
        justifyContent: "center"
    },
});
