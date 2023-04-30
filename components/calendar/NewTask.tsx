"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../auth/AuthProvider";
import axios from "axios";
import { showToast } from "@/utils/handleToast";

type Props = {};
const NewTask = (props: Props) => {
  const currentUser = useAuth()!;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState(new Date().toISOString().split(".")[0]);
  const [end, setEnd] = useState(new Date().toISOString().split(".")[0]);
  const queryClient = useQueryClient();

  const eventMutation = useMutation({
    mutationFn: () => {
      return axios.post("/api/tasks", {
        title: title,
        description: description,
        from: start,
        to: end,
        uid: currentUser.uid,
        email: currentUser.email,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      setTitle("");
      setDescription("");
      if (eventMutation.isError) showToast("error", "Error creating event");
      else showToast("success", "Event created successfully");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "" || !start) {
      showToast("error", "Title or Start date missing!");
      return;
    }
    eventMutation.mutate();
  };

  return (
    <form id="form" className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="title">Title</label>
        <Input
          wide={"lg"}
          id="title"
          type="text"
          autoFocus={true}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none border-2 focus-visible:outline-none bg-slate-50 border-slate-400 rounded p-2 focus:border-cyan-900 w-72 lg:w-96 md:w-80"
          rows={7}
          cols={45}
        ></textarea>
      </div>
      <div className="flex flex-col">
        <label htmlFor="start">Start</label>
        <Input
          wide={"lg"}
          id="start"
          type="datetime-local"
          value={start}
          onChange={(e) => {
            try {
              setStart(e.target.value);
            } catch (error) {
              showToast("error", "Invalid Date-Time value");
            }
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="end">End</label>
        <Input
          wide={"lg"}
          id="end"
          type="datetime-local"
          value={end}
          onChange={(e) => {
            try {
              setEnd(e.target.value);
            } catch (error) {
              showToast("error", "Invalid Date-Time value");
            }
          }}
        />
      </div>
      {eventMutation.isLoading ? (
        <Button size={"lg"} variant={"disabled"} disabled>
          Please Wait...
        </Button>
      ) : (
        <Button size={"lg"}>Save</Button>
      )}
    </form>
  );
};
export default NewTask;
