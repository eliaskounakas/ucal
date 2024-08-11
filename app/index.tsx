import Rect, { useState, useEffect } from 'react';
import { TimelineCalendar, EventItem, RangeTime } from "@howljs/calendar-kit";
import { StyleSheet } from 'react-native';
import fetchCourses from '../utils/fetchCourses';




export default function Calendar() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then((res) => {
        setEvents((prev) => [...prev, ...res]);
        console.log(events);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const _onDateChanged = (date: string) => {
    setIsLoading(true);
    fetchCourses()
      .then((res) => {
        setEvents((prev) => [...prev, ...res]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <TimelineCalendar 
      viewMode="week" 
      events={events}
      allowPinchToZoom
      isLoading={isLoading}
      onDateChanged={_onDateChanged}
      theme={{ loadingBarColor: '#D61C4E' }}
      initialDate='2024-05-10'
    />
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
});

