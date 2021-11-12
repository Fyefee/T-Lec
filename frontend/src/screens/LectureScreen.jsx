import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, PixelRatio, Platform, TouchableOpacity, View } from 'react-native'
import axios from 'axios';
import { API_LINK, CLIENTID } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Input, TextArea, VStack, HStack, Button, IconButton, Icon, Text,
    NativeBaseProvider, Center, Box, StatusBar, extendTheme, ScrollView,
    Image, Select, CheckIcon, Item, Modal, FormControl, AlertDialog
} from "native-base";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

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
        "contact": "Jeffyyyy",
        "description": "Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah",
        "permission": [
            "62070000@it.kmitl.ac.th",
            "62070999@it.kmitl.ac.th",
        ],
        "privacy": "private",
        "tag": [
            "Test",
            "Kuy",
        ],
        "title": "Test",
        "uploadedFile": [
            {
                "mimeType": "application/pdf",
                "name": "1ใบเซ็นชื่อเตรียมสอนแก้ไข06016317-OOP-อ.ธราวิเชษฐ์-กย.64.pdf",
                "size": 1433923,
                "type": "success",
                "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540jeffy34931%252FTLec/DocumentPicker/00990b16-a405-4dfd-890b-d4ceca474f6b.pdf",
            },
        ],
        "rating": 4.5,
        "comment": [
            {
                "userImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
                "userName": "Jeffy Za",
                "userEmail": "62070045@it.kmitl.ac.th",
                "comment": "Good"
            },
            {
                "userImage": "https://lh3.googleusercontent.com/a/AATXAJwO0xmKV4E3ef4UvdkySmG1_eE8ApICu9TTRVzR=s96-c",
                "userName": "Boos EiEi",
                "userEmail": "62070166@it.kmitl.ac.th",
                "comment": "GoodMak"
            },
        ]
    })

    const [isOpen, setIsOpen] = React.useState(false)
    const [deleteObject, setDeleteObject] = React.useState(null)
    const [commentInputRef, setCommentInputRef] = React.useState(null)

    const onClose = () => setIsOpen(false)

    const [newComment, setNewComment] = React.useState("")
    const [rating, setRating] = React.useState(0)

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

    const renderTagText = () => {
        let text = "";
        lecture.tag.map((element, index) => {
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
                        onPress={() => setRating(i)} />
                )
            } else {
                star.push(
                    <IconButton
                        key={i}
                        icon={<FontAwesome name="star-o" style={styles.starIcon} />}
                        size="sm"
                        borderRadius="full"
                        onPress={() => setRating(i)} />
                )
            }
        }
        console.log(user.image)
        return star;
    }

    const renderComment = () => {
        let comment = [];
        lecture.comment.map((element, index) => {
            comment.push(
                <HStack space="5" px="8" py="2" key={index} style={styles.commentBox}>
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
        setIsOpen(!isOpen);
    }

    const deleteComment = () => {
        let index = lecture.comment.indexOf(deleteObject);
        lecture.comment.splice(index, 1);
        onClose();
    }

    const addComment = () => {
        const comment = {
            "userImage": user.image,
            "userName": user.firstname + " " +  user.lastname,
            "userEmail": user.email,
            "comment": newComment
        }
        lecture.comment.push(comment);
        setNewComment("");
    }

    return (
        <NativeBaseProvider theme={theme}>
            <LinearGradient start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#c5d8ff', '#fedcc8']}
                style={styles.container}>
                <Appbar name={lecture.title} />
                <ScrollView
                    _contentContainerStyle={{
                        py: 3,
                    }}
                    style={styles.scrollStyle}
                >
                    <Box>
                        <HStack space="5" px="10">
                            <Image source={{ uri: user.image, }}
                                alt="Alternate Text" style={styles.profileImage} />
                            <HStack space="0" pt="2" direction='column' style={styles.profileBox}>
                                <Text pt="1" fontFamily="body" fontWeight="700" style={styles.profileText}>{user.firstname} {user.lastname}</Text>
                                <Text pt="1" fontFamily="body" fontWeight="700" style={styles.profileText}>Contact : {lecture.contact}</Text>
                            </HStack>
                        </HStack>

                        <HStack space="1" px="10" mt="3" direction='column'>
                            <Text pt="1" fontFamily="body" fontWeight="700" style={styles.descriptionText}>{lecture.description}</Text>
                            <Text pt="1" fontFamily="body" fontWeight="400" style={styles.tagText}>Tag : {renderTagText()}</Text>
                        </HStack>

                        <HStack space="1" px="8" mt="3" justifyContent="space-around">
                            <Button style={styles.downloadFileButton} size="lg"><Text style={styles.downloadFileButtonText}>Download</Text></Button>

                            <HStack space="1" pt="2">
                                {renderStar()}
                            </HStack>
                        </HStack>

                        <HStack space="1" px="4" mt="3" style={styles.ratingBox}>
                            <Button style={styles.downloadFileButton} size="lg"><Text style={styles.downloadFileButtonText}>Want to rate this?</Text></Button>

                            <HStack space="1" py="1">
                                {renderRatingIcon()}
                            </HStack>
                        </HStack>

                        <Box style={styles.separator} />

                        <HStack space="1" px="6" mt="4" direction='column'>
                            <Text pt="1" fontFamily="body" fontWeight="700" style={styles.commentHeaderText}>Comment</Text>
                            {renderComment()}
                        </HStack>

                        <HStack space="5" px="10" my="6">
                            <Input variant="rounded" placeholder="Comment"
                                size="md" px="8" style={styles.addCommentInput}
                                onChangeText={(inputText) => setNewComment(inputText)} 
                                getRef={(ref) => setCommentInputRef(ref)}/>
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
                    isOpen={isOpen}
                    onClose={onClose}
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
                                    colorScheme="coolGray"
                                    onPress={onClose}
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

                <NavigationBar page={"Lecture"} />
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
    }
});
