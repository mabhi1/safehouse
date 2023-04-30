"use client";

import Loading from "@/app/loading";
import useAuth from "@/components/auth/AuthProvider";
import FilteredEvents from "@/components/calendar/FilteredEvents";
import { TaskType } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Props = {
  params: { term: string };
};
const page = ({ params: { term } }: Props) => {
  const [task, setTask] = useState<TaskType[]>([]);
  const currentUser = useAuth();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/tasks?uid=${currentUser?.uid}`);
      setTask(data.tasks);
      return data;
    },
  });

  if (tasksQuery.isLoading) return <Loading />;
  if (tasksQuery.isError) throw tasksQuery.error;

  return <FilteredEvents setTask={setTask} task={task} term={term} />;
};
export default page;
