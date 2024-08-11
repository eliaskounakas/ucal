import React, { useEffect, useState} from 'react'
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { TimelineCalendar, EventItem } from '@howljs/calendar-kit';
import UspaceClient from 'uspace-api-wrapper';
import type { CourseData } from 'uspace-api-wrapper/dist/entities';

async function fetchCourses(username: string, password: string): Promise<EventItem[]> {
  const uClient = new UspaceClient();
  let courses: CourseData[] = []
  let events: EventItem[] = [];

  await uClient.login(username, password);
  courses = await uClient.getCourses(2024, false);
  const uniqCourses = new Set();

  let id: number = 1;
  for (const course of courses) {
    
    const lvNr: string = course.lehrveranstaltung.lvNr;
    if (uniqCourses.has(lvNr) || course.status === "ABGEMELDET") continue;
    else uniqCourses.add(lvNr);

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

export default function Calendar() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const username: string = String(process.env.EXPO_PUBLIC_USERNAME);
  const password: string = String(process.env.EXPO_PUBLIC_PASSWORD);


  useEffect(() => {
    fetchCourses(username, password)
      .then((res) => {
        setEvents(() => [...res]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <TimelineCalendar 
          viewMode="workWeek"
          events={events}
          isLoading={isLoading}
          initialDate='2024-03-01'
          theme={{ loadingBarColor: '#0063A6' }}
        />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? 30 : 0
   },
});

