import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import Routes from './src/router/Routes';
import LoginScreen from "./src/screens/Login.js";
import { useFonts } from '@expo-google-fonts/prompt'

export default function App() {

  //Edit here naja
  let [fontsLoaded] = useFonts({
    'Prompt-Light': require('./src/assets/fonts/Prompt-Light.ttf'),
    'Prompt-SemiBold': require('./src/assets/fonts/Prompt-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <></>
  }
  else {
    return (
      <Routes />
    );
  }
}

AppRegistry.registerComponent('App', () => App)

const styles = StyleSheet.create({

});
