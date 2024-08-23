import React from 'react'
import {  StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebLink from './WebLink';


export default function About() {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <View>
        <Text style={styles.title}>About u:cal</Text>
        <Text style={styles.text}>
          This is an unofficial calendar app for the University of Vienna. It is completely free and open-source. You can find the source code on Github.
          Developers interested in contributing: I warmly welcome your involvement.
        </Text>
        <WebLink customStyle={styles.link} url="https://github.com/eliaskounakas/ucal" name='GitHub Link' /> 
      </View>

      <View>
        <Text style={styles.title}>Contact</Text>
        <Text style={styles.text}>
          If you have any questions, feedback, or suggestions, I encourage you to reach out via email.
        </Text>
        <WebLink customStyle={styles.link} url="mailto:elias.kounakas@proton.me" name='Send an email' /> 
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
  },
  link: {
    fontSize: 20,
    marginTop: 10,
  },
  textContainer: {

  },
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: '100%',
    gap: 60,
    padding: 30,
  },
})