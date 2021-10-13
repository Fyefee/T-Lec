import React from 'react'
import { Router, Scene, Navigator } from 'react-native-router-flux'
import LoginScreen from '../screens/Login'
import HomeScreen from '../screens/Home'
import { CardStackStyleInterpolator } from 'react-navigation';

const Routes = () => {
    return (
        <Router>
            <Scene key="root" >
                <Scene key="login" component={LoginScreen} title="Login" initial headerShown={false}/>
                <Scene key="home" component={HomeScreen} title="Home" headerShown={false} />
            </Scene>
        </Router>
    )
}
export default Routes