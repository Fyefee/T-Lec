import React from 'react'
import LoginScreen from '../screens/Login'
import HomeScreen from '../screens/Home'
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
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default Routes