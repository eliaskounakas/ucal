import Rect, { useState } from 'react';
import { TimelineCalendar, EventItem, RangeTime } from "@howljs/calendar-kit";
import { StyleSheet } from 'react-native';

const exampleEvent: EventItem = 
{
  id: '1',
  title: 'Event 1',
  start: (new Date()).toISOString(),
  end: (new Date(Date.now() + 1e7)).toISOString(),
  color: '#A3C7D6',
};


export default function Calendar() {
  const [events, setEvents] = useState<EventItem[]>([]);

  const _onDragCreateEnd = (event: RangeTime) => {
    const randomId = Math.random().toString(36).slice(2, 10);
    const newEvent = {
      id: randomId,
      title: randomId,
      start: event.start,
      end: event.end,
      color: '#A3C7D6',
    };
    setEvents((prev) => [...prev, newEvent]);
  };
  return (
    <TimelineCalendar 
      viewMode="week" 
      events={[...events, exampleEvent]}
      allowPinchToZoom
      allowDragToCreate
      onDragCreateEnd={_onDragCreateEnd}
      theme={{
        dragHourContainer: {
          backgroundColor: '#FFF',
          borderColor: '#001253',
        },
        dragHourText: { color: '#001253' },
        dragCreateItemBackgroundColor: 'rgba(0, 18, 83, 0.2)',
      }}
    />
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
});

