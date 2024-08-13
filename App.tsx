import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { EventItem } from '@howljs/calendar-kit';
import Calendar from './components/Calendar';


const Drawer = createDrawerNavigator();

export default function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const calendarProps = { events, setEvents, isLoading, setIsLoading };

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