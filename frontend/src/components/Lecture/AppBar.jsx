import React from 'react'
import { StyleSheet } from 'react-native'
import { HStack, IconButton, Icon, Text, StatusBar } from "native-base";
import { Ionicons } from '@expo/vector-icons';

export default function AppBar(props) {

    return (
        <>
            <StatusBar backgroundColor="#fedcc8" barStyle="light-content" />
            <HStack bg='#fedcc8' px="4" py="1" style={styles.appbar}>
                <HStack space="2" alignItems='center'>
                    <IconButton icon={<Icon as={<Ionicons name="newspaper" size={24} />}
                        color="#8d7d75" size='md' />} />
                    <Text style={styles.appbarText} fontFamily="body" fontWeight="700">{props.name}</Text>
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
