import React, { useEffect, useState} from 'react'
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { TimelineCalendar, EventItem } from '@howljs/calendar-kit';
import UspaceClient from 'uspace-api-wrapper';
import type { CourseData } from 'uspace-api-wrapper/dist/entities';

async function fetchCourses(): Promise<EventItem[]> {
  const uClient = new UspaceClient();
  let courses: CourseData[] = []
  let events: EventItem[] = [];

  await uClient.login('eliask04', 'Sei8sam!');
  courses = await uClient.getCourses(2024, false);

  let id: number = 1;
  for (const course of courses) {
    const title: string = course.lehrveranstaltung.titel;
    const color: string = '#0063A6';

    for (const date of course.lehrveranstaltung.termine) {
      const start: string = (new Date(date.beginn)).toISOString();
      const end: string = (new Date(date.ende)).toISOString();

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

export default function Cal() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then((res) => {
        setEvents((prev) => [...prev, ...res]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <TimelineCalendar 
          viewMode="week"
          events={events}
          isLoading={isLoading}
          initialDate='2024-05-10'
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

