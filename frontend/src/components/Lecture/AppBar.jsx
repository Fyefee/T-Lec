import React from 'react'
import { StyleSheet } from 'react-native'
import { HStack, IconButton, Icon, Text, StatusBar } from "native-base";
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function AppBar(props) {

    const navigateToEditLecScreen = () => {
        props.navigation.navigate('CreateLec', { user: props.user, title: "Edit Post", lecture: props.lecture })
    }

    return (
        <>
            <StatusBar backgroundColor="#fedcc8" barStyle="light-content" />
            <HStack bg='#fedcc8' px="4" pt={Platform.OS === 'ios' ? 10 : 1} pb="1" style={styles.appbar}>
                <HStack space="2" alignItems='center'>
                    <Icon as={<Ionicons name="newspaper" size={24} />}
                        color="#8d7d75" size='md' />
                    <Text style={styles.appbarText} fontFamily="body" fontWeight="700">{props.lecture.title}</Text>
                </HStack>

                <HStack space="2" alignItems='center'>
                    {props.lecture.ownerEmail == props.user.email ? (
                        <IconButton icon={<Icon as={<FontAwesome name="edit" size={24} />}
                            color="#8d7d75" size='md' />} borderRadius="full" 
                            onPress={() => navigateToEditLecScreen()}/>
                    ) : (
                        <></>
                    )}

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
        color: "#8d7d75",
        paddingTop: 15,
        fontSize: 22,
    }
});
