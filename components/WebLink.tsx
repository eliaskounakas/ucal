import { useState } from 'react'
import {  StyleSheet, Text, Pressable, Linking, StyleProp, ViewStyle } from 'react-native';


export interface WebLinkProps {
  url: string,
  name: string,
  customStyle?: StyleProp<ViewStyle>,
}

export default function WebLink(props: WebLinkProps) {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <Pressable onPressIn={() => setIsActive(true)} onPressOut={() => setIsActive(false)} onPress={() => Linking.openURL(props.url)}>
      <Text style={[isActive ? styles.active : styles.inactive, props.customStyle ? props.customStyle : {}]}>{props.name}</Text>
    </Pressable>
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