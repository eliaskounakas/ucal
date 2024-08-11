
import UspaceClient from 'uspace-api-wrapper';
import type { CourseData } from 'uspace-api-wrapper/dist/entities';
import { EventItem } from "@howljs/calendar-kit";


const username: string = String(process.env.USERNAME);
const password: string = String(process.env.PASSWORD);


export default async function fetchData(): Promise<EventItem[]> {
  const uspaceClient = new UspaceClient();
  await uspaceClient.login(username, password);
  const courses: CourseData[] = await uspaceClient.getCourses(2024, false);

  let id: number = 1;
  let events: EventItem[] = [];

  for (const course of courses) {
    const title: string = course.lehrveranstaltung.titel;
    const color: string = '#A3C7D6';

    for (const date of course.lehrveranstaltung.termine) {
      const start: string = (new Date(date.beginn)).toISOString();
      const end: string = (new Date(date.ende)).toISOString();
      
      const newEvent: EventItem = {
        id: String(id),
        title: title,
        start: start,
        end: end,
        color: color,
      }

      id += 1;

      events.push(newEvent);
    }

  }

  return events;
}
