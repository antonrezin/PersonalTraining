import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import _ from "lodash";

// Define types for Training and ActivityData
interface Training {
  activity: string;
  duration: number;
}

interface ActivityData {
  activity: string;
  duration: number;
}

export default function Stat() {
  // States with types
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    getTrainings();
  }, []);

  useEffect(() => {
    generateActivityData(trainings);
  }, [trainings]);

  // Fetch trainings data
  const getTrainings = () => {
    fetch(
      "https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch trainings");
        }
        return response.json();
      })
      .then((responseData: Training[]) => {
        setTrainings(responseData);
      })
      .catch((error) => console.error(error));
  };

  // Process data for bar chart
  const generateActivityData = (trainings: Training[]) => {
    const groupedData: ActivityData[] = _(trainings)
      .groupBy("activity")
      .map((activities, activity) => ({
        activity,
        duration: _.sumBy(activities, "duration"),
      }))
      .value();

    setActivityData(groupedData);
  };

  // Render bar chart
  return (
    <div style={{ width: 1300, height: 500 }}>
      <ResponsiveContainer>
        <BarChart
          data={activityData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="activity" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="duration" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
