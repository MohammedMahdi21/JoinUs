// import { addData } from "."; -- Wasn't working.
import axios from "axios";
import { useState } from "react";
import cleanEvent from "./cleanEvent";

export default function useUserEvents() {
  const { cleanCreateEvent, cleanEditEvent } = cleanEvent();

  const userCreateEventSubmit = (event) => {
    cleanCreateEvent(event)
    // axios.post(url[, data[, config]]) <- syntax
    console.log("api post request from userCreateEventSubmit", event);
    // axios.post("http://localhost:8080/api/events", testDummyData)
    axios
      .post("http://localhost:8080/api/events", event)
      .then(() => {
        console.log(event);
      })
      .catch((err) => {
        console.log(err);
      });

    // both from the same call from the user
    /*
    Promise.all([
      axios.post("the endpoint for the join table", owner_id), 
      axios.post("the endpoint for the join table", event_id),
    ])
    .err(err => console.log(err));
  }*/
  };

  const userLeaveEvent = (event) => {
    axios
      .post("http://localhost:8080/event/leave", event)
      .then(() => {
        console.log(event);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const userJoinEvent = (event) => {
    axios
      .post("http://localhost:8080/event/join", event)
      .then(() => {
        console.log(event);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const userDeleteEvent = (event) => {
    axios
      .post("http://localhost:8080/event/delete", event)
      .then(() => {
        console.log(event);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const userEditEventSubmit = (event) => {
    console.log("api post request for userEditEvent");
    cleanEditEvent(event)
  };

  return {
    userCreateEventSubmit,
    userEditEventSubmit,
    userLeaveEvent,
    userJoinEvent,
    userDeleteEvent,
  };
}
