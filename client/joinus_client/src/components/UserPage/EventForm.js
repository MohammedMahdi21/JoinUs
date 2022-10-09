import React, { useState, setState, useRef } from "react";
import dayjs from "dayjs";
import useUserEvents from "../../hooks/useUserEvents";
import useAppData from "../../hooks/useAppData";
import CategoriesList from "./CategoriesList";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import {
  Button,
  Fab,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers";
import Search from "./Search";
import useSharedUser from "../../hooks/useSharedUser";

export default function EventForm(props) {
  console.log("props on load");
  console.log(props);
  let { open, setOpen, categoriesData, eventData, formMode } = props;
  const { usersData } = useAppData();
  const { user } = useSharedUser();

  /*
  - move eventform out of hooks, and into the events' folder.
  - would have the open state in the component that renders the form
  - move your open/setopen into the parent component, then pass the open state as props to the form component, 
  - create a function called "toggle form" -- we already have this as open? 
  - pass the toggle function as a prop to the eventForm
  - remove the state in the form open, when we click create event, calls toggle form for the create. and the same thing for the edit form.
  - when we click cancel on the form, call props.toggleform to close it.
  */


  const imageRef = useRef(null);
   // https://reactjs.org/docs/hooks-reference.html#useref
   const inputEl = useRef(null)
   const buttonClick = (e) => {
     console.log(e)
     console.log("--------------------")
     // console.log(inputEl.current.children[1].children[0].value) - correct object pathing we determined with a mentor
     console.log(inputEl.current.children[1].children[0].value)
   }

  const StyledModal = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // styles the elements inside the modal:
  const FormBoxStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& > :not(style)": { m: 1, width: "100%" },
  };

  // const [myEvent, setMyEvent] = useState("")
  const { userCreateEventSubmit, userEditEventSubmit } = useUserEvents();
  const [selected, setSelected] = useState({ lat: null, lng: null });

/* 
"i removed the set lat and long states....should this one giant object instead of separate useStates?" -Carmen

Good question! I asked a mentor about the difference of sending it all as one gigachad state object, and apparently its an older way of doing things when handling form data in react. With the scope of our project though, having them as individual states makes sense since its currently working. imho having a Form State object would be great for refactoring and i'm happy to do that once its all working with individual states

We also might need those lng/lat states, but i'll bring em back if we need em -Joba
*/

  // Form State
  const [eventForm, setEventForm] = useState("");

  const [eventName, setEventName] = useState(
    formMode === "edit" ? eventData.name : ""
  );
  const [eventImage, setEventImage] = useState(""); // image is breaking this atm
  const [eventDescription, setEventDescription] = useState(
    formMode === "edit" ? eventData.description : ""
  );
  const [eventSizeLimit, setEventSizeLimit] = useState("");
  const [eventCategory, setEventCategory] = useState(
    formMode === "edit" ? eventData.category : ""
  );
  const [eventCity, setEventCity] = useState(
    formMode === "edit" ? eventData.address : ""
  );
  const [startTime, setStartTime] = useState(dayjs("2022-09-28T15:00:00"));
  const [endTime, setEndTime] = useState(dayjs("2022-09-28T15:00:00"));

  function handleCancelClick(e) {
    formMode = "create";
    setOpen(false);
  }

  function checker () {
    console.log("detecting usersData...")
    if(usersData) {
      console.log("users data found:")
      console.log(usersData)
      return usersData[0].id
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={(e) => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={StyledModal}
      >
        <Box
          width={500}
          height={700}
          bgcolor="white"
          p={3}
          borderRadius={3}
          component="form"
          noValidate
          autoComplete="off"
          sx={FormBoxStyles}
          ref={inputEl}
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const sendDataObj = {
              eventName: data.get("label_eventName"),
              eventImage,
              eventDescription: data.get("label_eventDescription"),
              eventSizeLimit: 2,
              eventOwnerId: checker(),
              eventCategory: data.get("label_eventCategory"),
              eventCity: data.get("label_eventCity"),
              lat: 51.0233064354121, // use the auto feature from the google api
              lng: -114.02369425973428,
              start_time: startTime,
              end_time: endTime,
            };
            if (formMode === "create") {
              userCreateEventSubmit(sendDataObj);
            } else if (formMode === "edit") {
              userEditEventSubmit(sendDataObj);
            } else {
              console.log("something went wrong updating the formMode");
            }
            setOpen(false);
          }}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            {formMode === "create" ? "Create New Event" : "Edit Event"}
          </Typography>
          <TextField
            required
            id="standard-basic"
            label="Event Name"
            variant="standard"
            name="label_eventName"
            value={eventName}
            onChange={(event) => {
              setEventName(event.target.value);
            }}
          />

          <TextField
            required
            id="standard-basic"
            label="City"
            variant="standard"
            name="label_eventCity"
            value={eventCity}
            onChange={(event) => {
              event.preventDefault();
              setEventCity(event.target.value);
            }}
          />

          <Search setSelected={setSelected} />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              required
              label="Start Time"
              renderInput={(params) => <TextField {...params} />}
              value={startTime}
              onChange={(event) => {
                setStartTime(event.$d.toUTCString());
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              required
              label="End Time"
              value={endTime}
              renderInput={(params) => <TextField {...params} />}
              onChange={(event) => {
                setEndTime(event.$d.toUTCString());
              }}
            />
          </LocalizationProvider>

          <CategoriesList
            required
            categories={props.categories}
            name="label_eventCategory"
            value={eventCategory}
            onChange={(event) => {
              event.preventDefault();
              setEventCategory(event.target.value);
            }}
          />

          <TextField
            required
            id="outlined-textarea"
            label="Description"
            placeholder="..."
            multiline
            inputProps={{ maxLength: 300 }}
            name="label_eventDescription"
            value={eventDescription}
            onChange={(event) => {
              setEventDescription(event.target.value);
            }}
          />

          <Button variant="text" component="span" endIcon={<AddIcon />}>
              <label htmlFor="raised-button-file">
              <input
                accept="image/*"
                enctype = "multipart/form-data"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                name="label_eventImage"
                value={eventImage}
                onClick={(e) => {
                  console.log(e)
                  console.log(inputEl.current)
                  // console.log(inputEl.current.children[1].children[0].value)
                  
                }}
                onChange={(event) => {
                  // event.preventDefault()
                  // setMyEvent(prev => ({...prev, eventName: event.target.value}))
                  setEventImage(inputEl.current.children[1].children[0].value);
                  console.log(event.target.value);
                  console.log(`from event Image state: ${eventImage}`);
                }}
              />
                Upload Image
              </label>

            </Button>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button onClick={(e) => handleCancelClick(e)} variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" type="submit" endIcon={<AddIcon />}>
              {formMode === "create" ? "Create" : "Submit"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
