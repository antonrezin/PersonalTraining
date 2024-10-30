import { Calendar, dayjsLocalizer } from "react-big-calendar";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Define interfaces for Customer and Training data structures
interface Customer {
  firstname: string;
  lastname: string;
}

interface Training {
  id: string;
  date: string;
  duration: number;
  activity: string;
  customer: Customer;
}

export default function CalendarPage() {
  // States
  const localizer = dayjsLocalizer(dayjs);
  const [calendarTrainings, setCalendarTrainings] = useState<Training[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = () => {
      fetch(
        "https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings"
      )
        .then((response) => response.json())
        .then((data) => {
          setCalendarTrainings(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchData();
  }, []);

  // Event details for the calendar
  const events = calendarTrainings.map((item) => {
    const { id, date, duration, activity, customer } = item;

    try {
      const startDate = new Date(date);
      const endDate = dayjs(date).add(duration, "m").toDate();

      const title = `${activity} / ${customer?.firstname} ${customer?.lastname}`; // Create the event title

      return {
        id: id,
        title: title,
        start: startDate,
        end: endDate,
      };
    } catch (error) {
      // Log any errors related to event creation
      console.error(`Error ${id}:`, error);
      // Return null if there was an error
      return null;
    }
  });

  // Calendar
  const CustomCalendar = () => (
    <div>
      <Calendar
        localizer={localizer}
        events={events.filter((event) => event !== null)}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: 600,
          width: 1000,
          margin: "10px",
          backgroundColor: "#8894d2",
          color: "black",
        }}
      />
    </div>
  );

  // Render the custom calendar component
  return <CustomCalendar />;
}
