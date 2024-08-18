import { useEffect, useState} from 'react'
import { SafeAreaView, StyleSheet, Modal, View, Text, Pressable } from 'react-native';
import { TimelineCalendar, EventItem, CalendarViewMode, PackedEvent } from '@howljs/calendar-kit';
import UspaceClient from 'uspace-api-wrapper';
import type { CourseData } from 'uspace-api-wrapper/dist/entities';
import { StatusBar } from 'expo-status-bar';


export interface CalendarProps {
  viewMode: CalendarViewMode, 
  session: string,
  events: EventItem[], 
  setEvents: Function, 
  isLoading: boolean, 
  setIsLoading: Function
}

export interface CalendarModalProps {
  title: string,
  startTime: string, 
  endTime: string,
  location: string,
}

export default function Calendar({ viewMode, session, events, setEvents, isLoading, setIsLoading }: CalendarProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState<CalendarModalProps>({title: '', startTime: '', endTime: '', location: ''});

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
          onPressEvent={(event) => {setModalProps(generateModalProps(event)); setModalVisible(true);}}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalProps.title}</Text>
              <Text style={styles.modalText}>{modalProps.startTime}-{modalProps.endTime}</Text>
              <Text style={styles.modalText}>{modalProps.location}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
      </SafeAreaView>

      <StatusBar style='dark' />
    </>
  );
}

function generateModalProps(event: PackedEvent): CalendarModalProps {
  const props: CalendarModalProps = {
    title: event.title ? event.title : 'unknown',
    startTime: 'unknown',
    endTime: 'unknown',
    location: event.location ? event.location : 'unknown',
  }

  if (event.startHour && event.duration) {
    const startHours: number = Math.floor(event.startHour);
    const startMinutes: number = Math.round((event.startHour - startHours) * 60);
    const endHours: number = Math.floor(event.startHour + event.duration);
    const endMinutes: number = Math.round((event.startHour + event.duration - endHours) * 60);

    const start = new Date();
    const end = new Date();

    start.setHours(startHours, startMinutes);
    end.setHours(endHours, endMinutes);

    props.startTime = start.toTimeString().slice(0,4);
    props.endTime = end.toTimeString().slice(0, 4);
  }

  return props;
}

async function fetchCourses(session: string): Promise<EventItem[]> {
  let courses: CourseData[] = []
  let events: EventItem[] = [];
  let id: number = 1;
  
  const uClient = new UspaceClient();
  uClient.setSession = session;
  courses = await (await uClient.getCourses(2024, false)).json();
  
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
      const location: string = date.raumName;

      if (uniqueDates.has(start)) continue;
      else uniqueDates.add(start);

      const newEvent: EventItem = {
        id: `course${id}`,
        title: title,
        color: color,
        start: start,
        end: end,
        location: location,
      }

      events.push(newEvent);
      id++;
    }
  }

  return events;
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
   },
   centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

