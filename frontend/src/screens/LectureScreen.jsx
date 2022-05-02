import React, { useState, useEffect } from 'react'
import { useIsFocused } from "@react-navigation/native";
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity, View } from 'react-native'
import axios from 'axios';
import { API_LINK, CLIENTID, LECTURE_SERVICE_LINK } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Input, TextArea, VStack, HStack, Button, IconButton, Icon, Text,
    NativeBaseProvider, Center, Box, StatusBar, extendTheme, ScrollView,
    Image, Select, CheckIcon, Item, Modal, FormControl, AlertDialog, Spinner, Link
} from "native-base";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';

import ErrorAlert from '../components/ErrorAlert'
import NavigationBar from '../components/NavigationBar'
import Appbar from '../components/Lecture/AppBar'

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

    const { user } = route.params;

    let [lecture, setLecture] = React.useState({
        "contact": "",
        "description": "",
        "permission": [],
        "privacy": "",
        "tag": [],
        "title": "",
        "rating": 0,
        "comment": []
    })

    //let [lecture, setLecture] = React.useState({})

    const [isLoad, setIsLoad] = React.useState(false)
    const isFocused = useIsFocused();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [isRatingModalOpen, setIsRatingModalOpen] = React.useState(false)
    const [deleteObject, setDeleteObject] = React.useState(null)

    const onClose = () => setIsOpen(false)

    const [newComment, setNewComment] = React.useState("")
    const [rating, setRating] = React.useState(0)

    const [isAlertOpen, setIsAlertOpen] = React.useState(false)

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
            setIsLoad(true)
            const dataFromDB = await axios.get(`${API_LINK}/getlecturedata`, { params: { authId: user.authId, postID: route.params.lecture.postID } })
            // const dataFromDB = await axios.get(`${API_LINK}/getLectureData`, { params: { title: route.params.lecture.title, userEmail: user.email } })
            // const dataFromDB = await axios.get(`${LECTURE_SERVICE_LINK}/getLectureData`, { params: { title: route.params.lecture.title, userEmail: user.email } })
            setLecture(dataFromDB.data)
            setRating(dataFromDB.data.userRating)

            setIsLoad(true)

        }
        catch (e) {
            console.log("GetData error : ", e)
        }

    }, [isFocused])

    const renderTagText = () => {
        let text = "";
        lecture.tag.forEach((element, index) => {
            if (index != lecture.tag.length - 1) {
                text += element + ", "
            } else {
                text += element
            }
        })
        return text;
    }

    const renderStar = () => {
        let star = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= lecture.rating) {
                star.push(
                    <FontAwesome key={i} name="star" style={styles.starIconSelected} />
                )
            } else {
                star.push(
                    <FontAwesome key={i} name="star" style={styles.starIcon} />
                )
            }
        }
        return star;
    }

    const renderRatingIcon = () => {
        let star = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                star.push(
                    <IconButton
                        key={i}
                        icon={<FontAwesome name="star" style={styles.starIconSelected} />}
                        size="sm"
                        borderRadius="full"
                        onPress={() => openRateLecture(i)} />
                )
            } else {
                star.push(
                    <IconButton
                        key={i}
                        icon={<FontAwesome name="star-o" style={styles.starIcon} />}
                        size="sm"
                        borderRadius="full"
                        onPress={() => openRateLecture(i)} />
                )
            }
        }
        return star;
    }

    const renderComment = () => {
        let comment = [];
        lecture.comment.map((element, index) => {
            comment.push(
                <HStack space="5" px="8" py="2" mt="2" key={index} style={styles.commentBox}>
                    <Image mt="2" source={{ uri: element.userImage }}
                        alt="Alternate Text" style={styles.commentImage} />
                    <HStack space="0" pt="1" direction='column' style={styles.commentTextBox}>
                        <Text pt="1" fontFamily="body" fontWeight="400" style={styles.commentUserText}>{element.userName}</Text>
                        <Text pt="1" fontFamily="body" fontWeight="400" style={styles.commentText}>{element.comment}</Text>
                    </HStack>
                    {element.userEmail == user.email ? (
                        <IconButton
                            icon={<FontAwesome name="trash" size={20} color="red" />}
                            size="sm"
                            borderRadius="full"
                            style={styles.commentDeleteIcon}
                            onPress={() => openDeleteAlert(element)}
                        />
                    ) : (
                        <></>
                    )}

                </HStack>
            )
        })
        return comment;
    }

    const openDeleteAlert = (element) => {
        setDeleteObject(element)
        setIsDeleteModalOpen(!isDeleteModalOpen);
    }

    const deleteComment = async () => {

        try {

            await axios.delete(`${API_LINK}/comment`, { authId: user.authId, postID: lecture.postID, commentId: deleteObject.commentId })
            // await axios.delete(`${API_LINK}/deleteComment`, { params: { title: lecture.title, comment: deleteObject } })

            // await axios.post(`${LECTURE_SERVICE_LINK}/deleteComment`, { lecTitle: lecture.title, comment: deleteObject })

            let index = lecture.comment.indexOf(deleteObject);
            lecture.comment.splice(index, 1);

        } catch (err) {
            setIsAlertOpen(true)
        } finally {
            setIsDeleteModalOpen(!isDeleteModalOpen)
        }

    }

    const addComment = async () => {
        try {

            const comment = await axios.post(`${API_LINK}/comment`, { authId: user.authId, postID: lecture.postID, comment: newComment })
            lecture.comment.push(comment.data);
            setNewComment("");
        } catch (err) {
            console.log(err)
            setIsAlertOpen(true)
        }
    }

    const openRateLecture = (rate) => {
        setRating(rate)
        setIsRatingModalOpen(!isRatingModalOpen);
    }

    const rateLecture = async () => {
        try {
            await axios.put(`${API_LINK}/ratelecture`, { postID: lecture.postID, rating: rating, email: user.email })

            // await axios.post(`${LECTURE_SERVICE_LINK}/rateLecture`, { lecTitle: lecture.title, rating: rating, userEmail: user.email })
        }
        catch (err) {
            console.log(err)
            setIsAlertOpen(true)
        } finally {
            setIsRatingModalOpen(!isRatingModalOpen)
        }
    }

    const navigateToLibraryScreen = () => {
        if (lecture.ownerEmail == user.email) {
            navigation.navigate('Library', { user: user })
        }
        else {
            navigation.navigate('OtherLibrary', { user: user, ownerEmail: lecture.ownerEmail })
        }
    }

    const downloadFile = async () => {

        try {
            const dataFromDB = await axios.post(`${API_LINK}/downloadFile`, { lecture: lecture })

            const folder = FileSystem.StorageAccessFramework.getUriForDirectoryInRoot("DocumentPicker");
            console.log(folder);
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(folder);
            if (!permissions.granted) return;

            console.log(permissions);

            let filePath = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, "test.pdf", "application/pdf");
            
            console.log(filePath);

            // const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            // if (permissions.granted) {
            //     // Gets SAF URI from response
            //     const uri = permissions.directoryUri;
                
            //     // Gets all files inside of selected directory
            //     const files = await FileSystem.readDirectoryAsync(uri);
            //     console.log(files)
            //     // alert(`Files inside ${uri}:\n\n${JSON.stringify(files)}`);
            //   }

            try {
                console.log(filePath)
                await FileSystem.StorageAccessFramework.writeAsStringAsync(filePath, dataFromDB.data, { encoding: FileSystem.EncodingType.Base64 });
                console.log("download success!")
            } catch (err) {
                console.log(err);
            }
            // const filename = FileSystem.documentDirectory + "some_unique_file_name.pdf";
            // await FileSystem.writeAsStringAsync(filename, dataFromDB.data, {
            //     encoding: FileSystem.EncodingType.Base64,
            // });
            
        } catch (err) {
            console.log(err)
        }


        // const data = await axios({
        //     method: 'post',
        //     url: `${API_LINK}/downloadFile`,
        //     data: { 'lecture': lecture },
        //     responseType: 'arraybuffer',
        // }).then((response) => {
        //     return Buffer.from(response.data).toString('base64');
        // }).catch(function (error) {
        //     return null;
        // });

        //console.log(dataFromDB.data)
    }

    if (isLoad) {
        return (
            <NativeBaseProvider theme={theme}>
                <LinearGradient start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#c5d8ff', '#fedcc8']}
                    style={styles.container}>
                    <Appbar lecture={lecture} user={user} navigation={navigation} />
                    <ScrollView
                        _contentContainerStyle={{
                            py: 3,
                        }}
                        style={styles.scrollStyle}
                    >
                        <Box>
                            <HStack space="5" px="10">
                                <Image source={{ uri: lecture.ownerImage, }}
                                    key={lecture.ownerImage}
                                    alt="Alternate Text" style={styles.profileImage} />
                                <HStack space="0" pt="2" direction='column' style={styles.profileBox}>
                                    <Link onPress={() => navigateToLibraryScreen()}><Text pt="1" fontFamily="body" fontWeight="700" style={styles.profileText}>{lecture.ownerName} </Text></Link>
                                    <Text pt="1" fontFamily="body" fontWeight="700" style={styles.profileContact}>Contact : {lecture.contact}</Text>
                                </HStack>
                            </HStack>

                            <HStack space="1" px="10" mt="3" direction='column'>
                                <Text pt="1" fontFamily="body" fontWeight="700" style={styles.descriptionText}>Description : {lecture.description}</Text>
                                <Text pt="1" fontFamily="body" fontWeight="400" style={styles.tagText}>Tag : {renderTagText()}</Text>
                            </HStack>

                            <HStack space="1" px="8" mt="3" justifyContent="space-around">
                                {(lecture.privacy != "private") || (lecture.ownerEmail == user.email) || lecture.permission.includes(user.email) ? (
                                    <Button style={styles.downloadFileButton} size="lg" onPress={() => downloadFile()}>
                                        <Text style={styles.downloadFileButtonText}>Download</Text>
                                    </Button>
                                ) : (
                                    <Button style={styles.downloadFileButton} size="lg" isDisabled
                                        endIcon={<Icon as={FontAwesome} name="lock" size="sm" mb="1" />}>
                                        <Text style={styles.downloadFileButtonText}>Download</Text>
                                    </Button>
                                )}

                                <HStack space="1" pt="2">
                                    {renderStar()}
                                </HStack>
                            </HStack>

                            {lecture.ownerEmail != user.email ? (
                                <HStack space="1" px="4" mt="3" style={styles.ratingBox}>
                                    <Button style={styles.downloadFileButton} size="lg"><Text style={styles.downloadFileButtonText}>Want to rate this?</Text></Button>
                                    <HStack space="1" py="1">
                                        {renderRatingIcon()}
                                    </HStack>
                                </HStack>
                            ) : (
                                <Box style={styles.blankRating} />
                            )}

                            <Box style={styles.separator} />

                            <HStack space="1" px="6" mt="4" direction='column'>
                                <Text pt="1" fontFamily="body" fontWeight="700" style={styles.commentHeaderText}>Comment</Text>
                                {lecture.comment.length > 0 ? (
                                    <>
                                        {renderComment()}
                                    </>
                                ) : (
                                    <>
                                        <Text pt="1" pl="3" fontFamily="body" fontWeight="700" style={styles.descriptionText}>This lecture has no comment.</Text>
                                    </>
                                )}

                            </HStack>

                            <HStack space="5" px="10" my="6">
                                <Input variant="rounded" placeholder="Comment"
                                    size="md" px="6" style={styles.addCommentInput}
                                    onChangeText={(inputText) => setNewComment(inputText)}
                                    value={newComment} />
                                <IconButton
                                    size="md"
                                    variant="solid"
                                    borderRadius="full"
                                    style={styles.addCommentIcon}
                                    onPress={addComment}
                                    icon={<MaterialIcons name="file-upload" size={24} />}
                                />
                            </HStack>

                        </Box>

                    </ScrollView>

                    <AlertDialog
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                    >
                        <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Delete Comment</AlertDialog.Header>
                            <AlertDialog.Body>
                                Do you really want to delete this comment?
                        </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button.Group space={2}>
                                    <Button
                                        variant="unstyled"
                                        onPress={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                                    >
                                        Cancel
                                </Button>
                                    <Button colorScheme="danger" onPress={deleteComment}>
                                        Delete
                                </Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                        </AlertDialog.Content>
                    </AlertDialog>

                    <AlertDialog
                        isOpen={isRatingModalOpen}
                        onClose={() => setIsRatingModalOpen(!isRatingModalOpen)}
                    >
                        <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Rate this lecture</AlertDialog.Header>
                            <AlertDialog.Body>
                                <Text>Do you really want to rate {rating} for this comment?</Text>
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button.Group space={2}>
                                    <Button
                                        variant="unstyled"
                                        onPress={() => setIsRatingModalOpen(!isRatingModalOpen)}
                                    >
                                        Cancel
                                </Button>
                                    <Button colorScheme="warning" onPress={() => rateLecture()}>
                                        Rate
                                </Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                        </AlertDialog.Content>
                    </AlertDialog>

                    <ErrorAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen} />
                    <NavigationBar navigation={navigation} page={"Lecture"} user={user} />
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
                    <ScrollView
                        _contentContainerStyle={{
                            py: 3,
                        }}
                        style={styles.scrollStyle}
                    >
                        <Box style={styles.blankStyle}>
                            <Spinner size="lg" color="warning" />
                        </Box>

                    </ScrollView>

                    <NavigationBar navigation={navigation} page={"Lecture"} user={user} />
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
        fontSize: normalize(16),
        color: "#8d7d75"
    },
    profileContact: {
        fontSize: normalize(16),
    },
    profileBox: {
        width: "75%"
    },
    descriptionText: {
        fontSize: normalize(15)
    },
    tagText: {
        fontSize: normalize(15)
    },
    downloadFileButton: {
        borderRadius: 10,
        backgroundColor: "#ffb287",
        justifyContent: "center",
        alignItems: "center",
    },
    downloadFileButtonText: {
        color: "white",
        fontSize: normalize(15)
    },
    starIcon: {
        fontSize: normalize(18),
        color: "black"
    },
    starIconSelected: {
        fontSize: normalize(18),
        color: "salmon"
    },
    ratingBox: {
        width: "100%",
        justifyContent: "center",
        backgroundColor: '#ffb287',
    },
    separator: {
        height: getScreenHeight() * 0.04,
        backgroundColor: "#fef1e6",
        width: "100%"
    },
    commentHeaderText: {
        fontSize: normalize(18)
    },
    commentBox: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        width: "100%"
    },
    commentImage: {
        width: getScreenWidth() * 0.1,
        height: getScreenWidth() * 0.1,
        borderRadius: getScreenWidth() * 0.16,
    },
    commentUserText: {
        fontSize: normalize(14),
        color: "gray"
    },
    commentText: {
        fontSize: normalize(14)
    },
    commentTextBox: {
        width: "75%"
    },
    commentDeleteIcon: {
        position: "absolute",
        top: getScreenWidth() * 0.015,
        right: getScreenWidth() * 0.015
    },
    addCommentInput: {
        backgroundColor: "white",
        width: "80%"
    },
    addCommentIcon: {
        backgroundColor: "#ffb287",
        color: "white"
    },
    blankStyle: {
        minHeight: getScreenHeight() * 0.3,
        justifyContent: "center"
    },
    blankRating: {
        minHeight: getScreenHeight() * 0.025,
        justifyContent: "center"
    },
});
