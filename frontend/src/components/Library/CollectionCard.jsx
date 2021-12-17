import React from 'react'
import { StyleSheet, Dimensions, PixelRatio, TouchableOpacity } from 'react-native'
import { HStack, Text, Spinner, Wrap, Popover, Button, IconButton, AlertDialog } from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { API_LINK, CLIENTID, LECTURE_SERVICE_LINK } from '@env';
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

export default function NewLectureList(props) {

    const [isOpen, setIsOpen] = React.useState(false)
    const onClose = () => setIsOpen(false)

    const [deleteObject, setDeleteObject] = React.useState(null)

    const renderCollection = () => {
        let collectionArray = [];
        props.collection.map((element, index) => {
            collectionArray.push(
                <TouchableOpacity key={index} style={styles.collectionBox} my="2"
                    onPress={() => navigateToLectureScreen(element)}>
                    <Text numberOfLines={2} pt="2" px="2">{element.title}</Text>
                    <HStack space="1" p="1" style={styles.collectionBoxStack}>
                        {element.privacy == "public" ? (
                            <Ionicons name="earth-sharp" style={styles.collectionPrivacyIcon} />
                        ) : (
                            <FontAwesome name="lock" style={styles.collectionPrivacyIcon} />
                        )}

                        <Popover
                            trigger={(triggerProps) => {
                                return (
                                    <IconButton
                                        icon={<FontAwesome name="ellipsis-v" style={styles.collectionMoreIcon} />}
                                        size="sm"
                                        borderRadius="full" {...triggerProps} />
                                )
                            }}
                        >
                            <Popover.Content w="32">
                                <Popover.Body>
                                    <Button colorScheme="danger" variant="unstyled" onPress={() => openDeleteAlert(element)}>
                                        <Text fontFamily="body" fontWeight="700">Delete</Text>
                                    </Button>
                                </Popover.Body>
                            </Popover.Content>
                        </Popover>

                    </HStack>
                </TouchableOpacity>
            )
        })
        return collectionArray;
    }

    const openDeleteAlert = (element) => {
        setDeleteObject(element)
        setIsOpen(!isOpen);
    }

    const navigateToLectureScreen = (lecture) => {
        props.navigation.navigate('Lecture', { user: props.user, lecture: lecture })
    }

    const deleteCollection = async () => {
        try {
            // await axios.delete(`${API_LINK}/deleteLec`, { params: { title: deleteObject.title } })
            await axios.delete(`${LECTURE_SERVICE_LINK}/deleteLec`, { params: { title: deleteObject.title } })
            props.collection.splice(props.collection.indexOf(deleteObject), 1)
        } catch (err) {
            props.setIsAlertOpen(true)
        } finally {
            onClose();
        }
    }

    if (props.isLoad) {
        return (
            <>
                <LinearGradient start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#c5d8ff', '#fedcc8']}
                    style={styles.collectionCard}
                    px="3"
                >
                    <Text pt="6" pl="5" fontFamily="body" fontWeight="700" style={styles.collectionHeader}>Collection</Text>
                    {props.collection.length > 3 ? (
                        <Wrap direction="row" style={styles.collectionWrap} pt="2" pb="6">
                            {renderCollection()}
                        </Wrap>
                    ) : (
                        <HStack space="2" pt="2" pb="6">
                            {renderCollection()}
                        </HStack>
                    )}
                </LinearGradient>
                <AlertDialog
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Delete Lecture</AlertDialog.Header>
                        <AlertDialog.Body>
                            Do you really want to delete this lecture?
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button.Group space={2}>
                                <Button
                                    variant="unstyled"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button colorScheme="danger" onPress={deleteCollection}>
                                    Delete
                                </Button>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </>
        );
    }
    else {
        return (
            <LinearGradient start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['#c5d8ff', '#fedcc8']}
                style={styles.collectionCard}
            >
                <Spinner size="lg" color="emerald" />
            </LinearGradient>
        )
    }


}

const styles = StyleSheet.create({
    collectionCard: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: "hidden",
        borderRadius: getScreenWidth() * 0.035,
        minHeight: getScreenHeight() * 0.1
    },
    collectionHeader: {
        fontSize: normalize(20),
        alignSelf: "flex-start"
    },
    collectionWrap: {
        justifyContent: "space-evenly"
    },
    collectionBox: {
        width: '30%',
        height: getScreenHeight() * 0.15,
        borderRadius: getScreenWidth() * 0.025,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        marginTop: 8
    },
    collectionBoxStack: {
        position: "absolute",
        right: 0,
        top: 0
    },
    collectionPrivacyIcon: {
        fontSize: normalize(19),
        color: "#818181",
        paddingTop: 2
    },
    collectionMoreIcon: {
        fontSize: normalize(19),
        color: "#818181",
    },
    popOverDeleteButton: {
        width: getScreenHeight() * 0.15,
    },
});
