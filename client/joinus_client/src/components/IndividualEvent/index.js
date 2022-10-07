import { Box, Stack, Typography } from "@mui/material";
import { findEventAttendees } from "../../helpers/user_selectors";
import useSharedEvent from "../../hooks/useSharedEvent";

import EventDetails from "./EventDetails";
import EventMap from "./EventMap";
import JoinEventButton from "./JoinEventButton";
import Sidebar from "../UserPage/Sidebar";
import CommentBox from "./CommentBox";

export default function IndividualEvent(props) {
  const { joinedEvents, usersData, comments, user, reload, setReload } = props;
  const { event } = useSharedEvent();

  console.log(event);

  const attendeelist = findEventAttendees(event.id, usersData, joinedEvents);
  
  return (
    <Box flex={"row"}>
      <Box display="flex" justifyContent="center" alignItems="center" m={3}>
        <Typography variant="h4">{event.name}</Typography>
      </Box>
      <Box>
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
          <EventDetails attendeelist={attendeelist} />
          <EventMap />
        </Stack>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row-reverse", m: 5 }}>
        <JoinEventButton user={user} reload={reload} setReload={setReload} joinedEvents={joinedEvents} event={event} usersData={usersData}/>
      </Box>
      <CommentBox comments={comments} event={event} user={user} reload={reload} setReload={setReload} joinedEvents={joinedEvents}/>
    </Box>
  );
}
