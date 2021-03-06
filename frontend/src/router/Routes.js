import React from 'react'

import LoginScreen from '../screens/Login'
import HomeScreen from '../screens/HomeScreen'
import CreateLecScreen from '../screens/CreateLecScreen'
import LectureScreen from "../screens/LectureScreen"
import RankingScreen from "../screens/RankingScreen.jsx"
import LibraryScreen from "../screens/LibraryScreen.jsx"
import OtherLibraryScreen from "../screens/OtherLibraryScreen"
import SearchScreen from '../screens/SearchScreen'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Routes = () => {
    return (
        //        <Router>
        //           <Scene key="root" >
        //                <Scene key="login" component={LoginScreen} title="Login" initial headerShown={false}/>
        //                <Scene key="home" component={HomeScreen} title="Home" headerShown={false} />
        //            </Scene>
        //        </Router>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="CreateLec" component={CreateLecScreen} />
                <Stack.Screen name="Lecture" component={LectureScreen} />
                <Stack.Screen name="Library" component={LibraryScreen} />
                <Stack.Screen name="OtherLibrary" component={OtherLibraryScreen} />
                <Stack.Screen name="Ranking" component={RankingScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default Routes