import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Calendar from './index';


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Week">
          {() => <Calendar viewMode={'week'} />}
        </Drawer.Screen>
        <Drawer.Screen name="Work Week">
          {() => <Calendar viewMode={'workWeek'} />}
        </Drawer.Screen>
        <Drawer.Screen name="3 Days">
          {() => <Calendar viewMode={'threeDays'} />}
        </Drawer.Screen>
        <Drawer.Screen name="Day">
          {() => <Calendar viewMode={'day'} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}