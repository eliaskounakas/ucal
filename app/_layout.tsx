import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Calendar from './index';


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="7 Days" component={() => <Calendar viewMode={'workWeek'}/>}/>
        <Drawer.Screen name="5 Days" component={() => <Calendar viewMode={'week'}/>}/>
        <Drawer.Screen name="3 Days" component={() => <Calendar viewMode={'threeDays'}/>}/>
        <Drawer.Screen name="1 Day" component={() => <Calendar viewMode={'day'}/>}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}