import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
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
  const loginProps = { session, setSession };

  if (session) {
    return (
      <NavigationContainer independent={true}>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Week">
            {() => <Calendar viewMode={'week'} {...calendarProps}/>}
          </Drawer.Screen>
          <Drawer.Screen name="Work Week">
            {() => <Calendar viewMode={'workWeek'} {...calendarProps}/>}
          </Drawer.Screen>
          <Drawer.Screen name="3 Days">
            {() => <Calendar viewMode={'threeDays'} {...calendarProps}/>}
          </Drawer.Screen>
          <Drawer.Screen name="Day">
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