import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import Routes from './src/router/Routes';
import LoginScreen from "./src/screens/Login.js";

export default function App() {
  return (
    <Routes />
  );
}

AppRegistry.registerComponent('App', () => App)

const styles = StyleSheet.create({

});
