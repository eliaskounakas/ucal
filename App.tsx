import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { EventItem } from "@howljs/calendar-kit";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from '@expo/vector-icons/AntDesign';
import Calendar, { type CalendarProps} from "./components/Calendar";
import Login, { type LoginProps} from "./components/LoginScreen";
import Settings from "./components/Settings";
import About from "./components/About";


const Drawer = createDrawerNavigator();

export default function App() {
  const [session, setSession] = useState<string>("");
  const [courses, setCourses] = useState<EventItem[]>([]);
  const [isFetchingCourses, setIsFetchingCourses] = useState<boolean>(true);

  const calendarProps: CalendarProps = { session, courses, setCourses, isFetchingCourses, setIsFetchingCourses };
  const loginProps: LoginProps = { setSession };

  function CustomCalendarDrawerContent(props: any) {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <SafeAreaView>
          <DrawerItem
            label="u:cal"
            labelStyle={{ fontSize: 25, color: "black" }}
            style={{ marginBottom: 5 }}
            onPress={() => {}}
          />
          <DrawerItemList {...props} />
          <View style={styles.drawerDivider} />
        </SafeAreaView>

        <SafeAreaView>
          {/* <View style={styles.drawerDivider} />
          <DrawerItem 
            label="Settings"
            onPress={() => {props.navigation.navigate("Settings")}}
            icon={() => (<MaterialIcons name="settings" size={24} color="grey"/>)}
            style={{ display: "none" }}
          /> */}

          <DrawerItem
            label="About"
            onPress={() => {props.navigation.navigate("About")}}
            icon={() => (<AntDesign name="questioncircleo" size={24} color="grey" />)}
          />
          <View style={styles.drawerDivider} />
          <DrawerItem
            label="Logout"
            labelStyle={{ color: "#cc0000" }}
            onPress={async () => {
              await SecureStore.deleteItemAsync("ucal-username");
              await SecureStore.deleteItemAsync("ucal-password");
              setSession("");
            }}
            icon={() => (
              <MaterialIcons name="logout" size={24} color="#cc0000" />
            )}
          />
        </SafeAreaView>
      </DrawerContentScrollView>
    );
  }

  if (session) {
    return (
      <NavigationContainer independent={true}>
        <Drawer.Navigator
          initialRouteName="Work Week"
          screenOptions={{
            title: "u:cal",
          }}
          drawerContent={(props) => <CustomCalendarDrawerContent {...props} />}
        >
          <Drawer.Group screenOptions={{
            drawerActiveTintColor: "#25A9E2",
            drawerInactiveTintColor: "grey",
          }}>
            <Drawer.Screen
              name="Week"
              options={{
                drawerLabel: "Week",
                drawerIcon: ({ focused }) => (
                  <MaterialCommunityIcons
                    name="calendar-week"
                    size={24}
                    color={focused ? "#25A9E2" : "grey"}
                  />
                ),
              }}
            >
              {() => <Calendar  {...calendarProps} />}
            </Drawer.Screen>
            <Drawer.Screen
              name="Work Week"
              options={{
                drawerLabel: "Work Week",
                drawerIcon: ({ focused }) => (
                  <MaterialIcons
                    name="calendar-view-week"
                    size={24}
                    color={focused ? "#25A9E2" : "grey"}
                  />
                ),
              }}
            >
              {() => <Calendar  {...calendarProps} />}
            </Drawer.Screen>
            <Drawer.Screen
              name="3 Days"
              options={{
                drawerLabel: "3 Days",
                drawerIcon: ({ focused }) => (
                  <MaterialCommunityIcons
                    name="view-week-outline"
                    size={24}
                    color={focused ? "#25A9E2" : "grey"}
                  />
                ),
              }}
            >
              {() => <Calendar  {...calendarProps} />}
            </Drawer.Screen>
            <Drawer.Screen
              name="Day"
              options={{
                drawerLabel: "Day",
                drawerIcon: ({ focused }) => (
                  <MaterialCommunityIcons
                    name="view-day-outline"
                    size={24}
                    color={focused ? "#25A9E2" : "grey"}
                  />
                ),
              }}
            >
              {() => <Calendar  {...calendarProps} />}
            </Drawer.Screen>
            <Drawer.Screen name="Settings" options={{drawerLabel: "Settings", title: "Settings", drawerItemStyle: {display: "none"} }} component={Settings} />
            <Drawer.Screen name="About" options={{drawerLabel: "About", title: "About", drawerItemStyle: {display: "none"} }} component={About} />

          </Drawer.Group>
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <>
      <Login {...loginProps} />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  drawerDivider: {
    borderBottomColor: "grey",
    borderBottomWidth: 1.5,
  },
});
