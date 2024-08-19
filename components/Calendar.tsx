import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Modal,
  View,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
const { width: ScreenWidth } = Dimensions.get("screen");
import {
  TimelineCalendar,
  EventItem,
  CalendarViewMode,
  PackedEvent,
} from "@howljs/calendar-kit";
import UspaceClient from "uspace-api-wrapper";
import type { CourseData } from "uspace-api-wrapper/dist/entities";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import MoodleLogo from "../assets/moodle.svg";
import WebLink from "./WebLink";

export interface CalendarProps {
  viewMode: CalendarViewMode;
  session: string;
  events: EventItem[];
  setEvents: Function;
  isLoading: boolean;
  setIsLoading: Function;
}

export interface CalendarModalProps {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  ufindLink: string;
  moodleLink: string;
}

export default function Calendar(props: CalendarProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState<CalendarModalProps | null>(null);

  useEffect(() => {
    //need to make this better understandable, isLoaded/fetchedCourses/isCached would make more sense
    if (props.isLoading) {
      fetchCourses(props.session)
        .then((res) => {
          props.setEvents(() => [...res]);
        })
        .finally(() => {
          props.setIsLoading(false);
        });
    }
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TimelineCalendar
          viewMode={props.viewMode}
          events={props.events}
          isLoading={props.isLoading}
          initialDate="2024-03-01"
          theme={{ loadingBarColor: "#0063A6" }}
          onPressEvent={(event) => {
            setModalProps(generateModalProps(event));
            setModalVisible(true);
            console.log(event);
          }}
        />
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={() => setModalVisible(false)}
          >
            <Pressable style={[styles.modalView, { marginBottom: 0 }]}>
              <Text style={styles.modalTitle}>{modalProps?.title}</Text>
              <View style={styles.divider} />
              <View style={styles.modalRow}>
                <Feather
                  name="clock"
                  size={15}
                  color="#ADD8E6"
                  style={{ alignSelf: "center" }}
                />
                <Text>
                  {modalProps?.startTime}-{modalProps?.endTime}
                </Text>
                <Text>{modalProps?.date}</Text>
              </View>
              <View style={styles.modalRow}>
                <Feather
                  name="map-pin"
                  size={15}
                  color="#ADD8E6"
                  style={{ alignSelf: "center" }}
                />
                <Text>{modalProps?.location}</Text>
              </View>
              <View style={styles.modalRow}>
                <Feather
                  name="book-open"
                  size={15}
                  color="#ADD8E6"
                  style={{ alignSelf: "center" }}
                />
                <WebLink
                  url={String(modalProps?.ufindLink)}
                  name="u:find course overview"
                />
              </View>
              <View style={styles.modalRow}>
                <MoodleLogo
                  width={20}
                  height={20}
                  fill={"#ADD8E6"}
                  style={{ alignSelf: "center", marginRight: -5 }}
                />
                <WebLink
                  url={String(modalProps?.moodleLink)}
                  name="Moodle course material"
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>

      <StatusBar style="dark" />
    </>
  );
}

function generateModalProps(event: PackedEvent): CalendarModalProps {
  const props: CalendarModalProps = {
    title: event.title ? event.title : "unknown",
    date: "unknown",
    startTime: "unknown",
    endTime: "unknown",
    location: event.location,
    ufindLink: event.ufindLink,
    moodleLink: event.moodleLink,
  };

  if (event.startHour && event.duration) {
    const startHours: number = Math.floor(event.startHour);
    const startMinutes: number = Math.round(
      (event.startHour - startHours) * 60
    );
    const endHours: number = Math.floor(event.startHour + event.duration);
    const endMinutes: number = Math.round(
      (event.startHour + event.duration - endHours) * 60
    );

    const start = new Date();
    const end = new Date();

    start.setHours(startHours, startMinutes);
    end.setHours(endHours, endMinutes);

    props.startTime = start.toTimeString().slice(0, 5);
    props.endTime = end.toTimeString().slice(0, 5);

    const date = new Date(Date.parse(event.start));
    props.date = date.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return props;
}

async function fetchCourses(session: string): Promise<EventItem[]> {
  let courses: CourseData[] = [];
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
    const color: string = "#ADD8E6";
    const moodleLink: string = course.elearningCourse
      ? course.elearningCourse.url
      : "https://moodle.unievie.ac.at/";

    const uniqueDates = new Set();
    for (const date of course.lehrveranstaltung.termine) {
      const start: string = new Date(date.beginn).toISOString();
      const end: string = new Date(date.ende).toISOString();
      const location: string = date.raumName;

      const year: number = new Date(Date.parse(start)).getFullYear();
      const month: number = new Date(Date.parse(start)).getMonth();
      const semester: "W" | "S" = month < 2 || month > 7 ? "W" : "S";

      const ufindLink: string = `https://ufind.univie.ac.at/en/course.html?lv=${lvNr}&semester=${year}${semester}`;

      if (uniqueDates.has(start)) continue;
      else uniqueDates.add(start);

      const newEvent: EventItem = {
        id: `course${id}`,
        title: title,
        color: color,
        start: start,
        end: end,
        location: location,
        ufindLink: ufindLink,
        moodleLink: moodleLink,
      };

      events.push(newEvent);
      id++;
    }
  }

  return events;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: ScreenWidth * 0.9,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
    width: ScreenWidth * 0.9 - 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  divider: {
    borderBottomColor: "black",
    borderBottomWidth: 1.5,
    marginBottom: 15,
  },
  link: {
    color: "#25A9E2",
  },
});
