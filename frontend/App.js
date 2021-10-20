import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import Routes from './src/router/Routes';
import LoginScreen from "./src/screens/Login.js";
import { useFonts } from '@expo-google-fonts/prompt'

export default function App() {

  let [fontsLoaded] = useFonts({
    'Prompt-Light': require('./src/assets/fonts/Prompt-Light.ttf'),
    'Prompt-SemiBold': require('./src/assets/fonts/Prompt-SemiBold.ttf'),
    'Prompt-Black': require('./src/assets/fonts/Prompt-Black.ttf'),
    'Prompt-BlackItalic' : require('./src/assets/fonts/Prompt-BlackItalic.ttf'),
    'Prompt-Bold' : require('./src/assets/fonts/Prompt-Bold.ttf'),
    'Prompt-BoldItalic' : require('./src/assets/fonts/Prompt-BoldItalic.ttf'),
    'Prompt-ExtraBold' : require('./src/assets/fonts/Prompt-ExtraBold.ttf'),
    'Prompt-ExtraBoldItalic' : require('./src/assets/fonts/Prompt-ExtraBoldItalic.ttf'),
    'Prompt-ExtraLight' : require('./src/assets/fonts/Prompt-ExtraLight.ttf'),
    'Prompt-ExtraLightItalic' : require('./src/assets/fonts/Prompt-ExtraLightItalic.ttf'),
    'Prompt-Italic' : require('./src/assets/fonts/Prompt-Italic.ttf'),
    'Prompt-LightItalic' : require('./src/assets/fonts/Prompt-LightItalic.ttf'),
    'Prompt-Medium' : require('./src/assets/fonts/Prompt-Medium.ttf'),
    'Prompt-MediumItalic' : require('./src/assets/fonts/Prompt-MediumItalic.ttf'),
    'Prompt-Regular' : require('./src/assets/fonts/Prompt-Regular.ttf'),
    'Prompt-SemiBoldItalic' : require('./src/assets/fonts/Prompt-SemiBoldItalic.ttf'),
    'Prompt-Thin' : require('./src/assets/fonts/Prompt-Thin.ttf'),
    'Prompt-ThinItalic' : require('./src/assets/fonts/Prompt-ThinItalic.ttf'),

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
