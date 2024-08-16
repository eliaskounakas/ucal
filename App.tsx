import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { EventItem } from '@howljs/calendar-kit';
import Calendar from './components/Calendar';
import Login from './components/LoginScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<string>('');

  const calendarProps = { session, events, setEvents, isLoading, setIsLoading };
  const loginProps = { setSession };


  function CustomCalendarDrawerContent(props: any) {
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1,  flexDirection: 'column', justifyContent: 'space-between' }}>
        
        <SafeAreaView>
          <DrawerItem label="Calendar" labelStyle={{fontSize: 25, color: 'black'}} style={{marginBottom: 5}} onPress={() => {}}/>
          <DrawerItemList {...props} />
          <View style={styles.drawerDivider}/>
        </SafeAreaView>
        
        <SafeAreaView>
        <View style={styles.drawerDivider} />
          <DrawerItem label="Logout" labelStyle={{color: '#cc0000'}} onPress={() => {setSession('')}}/>
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
            title: 'Calendar',
          }}
          drawerContent={props => <CustomCalendarDrawerContent {...props}/>}
        >
          <Drawer.Screen name="Week" options={{
            drawerLabel: 'Week',
          }}>
            {() => <Calendar viewMode={'week'} {...calendarProps}/>}
          </Drawer.Screen >
          <Drawer.Screen name="Work Week" options={{
            drawerLabel: 'Work Week',
          }}>
            {() => <Calendar viewMode={'workWeek'} {...calendarProps}/>}
          </Drawer.Screen>
          <Drawer.Screen name="3 Days" options={{
            drawerLabel: '3 Days',
          }}>
            {() => <Calendar viewMode={'threeDays'} {...calendarProps}/>}
          </Drawer.Screen>
          <Drawer.Screen name="Day" options={{
            drawerLabel: 'Day',
          }}>
            {() => <Calendar viewMode={'day'} {...calendarProps}/>}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
  
  return (
    <Login {...loginProps}/>
  )
}


const styles = StyleSheet.create({
  drawerDivider: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1.5,
  },
})