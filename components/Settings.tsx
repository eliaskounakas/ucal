import React from 'react'
import {  StyleSheet, Text, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Settings() {
  return (
    <SafeAreaView>
      <Text>Settings</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  inactive: {
    color: '#25A9E2'
  },
  active: {
    color: '#ADD8E6'
  },
})