import React from 'react'
import { Router, Scene } from 'react-native-router-flux'
import LoginScreen from '../screens/Login'
import HomeScreen from '../screens/Home'

const Routes = () => {
    return (
        <Router>
            <Scene key="root">
                <Scene key="login" component={LoginScreen} title="Login" initial headerShown={false} animationEnabled={false}/>
                <Scene key="home" component={HomeScreen} title="Home" headerShown={false} animationEnabled={false}/>
            </Scene>
        </Router>
    )
}
export default Routes