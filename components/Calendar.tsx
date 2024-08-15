import React, { useEffect, useState} from 'react'
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { TimelineCalendar, EventItem, CalendarViewMode } from '@howljs/calendar-kit';
import UspaceClient from 'uspace-api-wrapper';
import type { CourseData } from 'uspace-api-wrapper/dist/entities';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

NavigationBar.setPositionAsync('absolute')
NavigationBar.setBackgroundColorAsync('#00000000')
NavigationBar.setButtonStyleAsync("dark");

export interface CalendarProps {
  viewMode: CalendarViewMode, 
  session: string,
  events: EventItem[], 
  setEvents: Function, 
  isLoading: boolean, 
  setIsLoading: Function
}

export default function Calendar({ viewMode, session, events, setEvents, isLoading, setIsLoading }: CalendarProps) {
  useEffect(() => {
    if (isLoading) {
      fetchCourses(session)
      .then((res) => {
        setEvents(() => [...res]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TimelineCalendar 
          viewMode={viewMode}
          events={events}
          isLoading={isLoading}
          initialDate='2024-03-01'
          theme={{ loadingBarColor: '#0063A6' }}
        />
      </SafeAreaView>
      <StatusBar style='dark' />
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
   },
});



async function fetchCourses(session: string): Promise<EventItem[]> {

  let courses: CourseData[] = []
  let events: EventItem[] = [];
  let id: number = 1;
  
  const uClient = new UspaceClient();
  uClient.setSession = session;
  courses = await uClient.getCourses(2024, false);
  
  const uniqueCourses = new Set();
  for (const course of courses) {
    
    const lvNr: string = course.lehrveranstaltung.lvNr;
    if (uniqueCourses.has(lvNr) || course.status === "ABGEMELDET") continue;
    else uniqueCourses.add(lvNr);

    const title: string = course.lehrveranstaltung.titel;
    const color: string = '#B1AFFF';

    const uniqueDates = new Set();
    for (const date of course.lehrveranstaltung.termine) {
      const start: string = (new Date(date.beginn)).toISOString();
      const end: string = (new Date(date.ende)).toISOString();

      if (uniqueDates.has(start)) continue;
      else uniqueDates.add(start);

      const newEvent: EventItem = {
        id: String(id),
        title: title,
        color: color,
        start: start,
        end: end,
      }

      events.push(newEvent);
      id++;
    }


  }

  return events;
}