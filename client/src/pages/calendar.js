import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Calendar from "react-calendar";
import Container from "react-bootstrap/Container";
import "react-calendar/dist/Calendar.css";
import { DateContext } from "../context/app-contexts";

export default function CalendarComponent() {
  const dateContext = useContext(DateContext);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    // Remount when a new date is selected
  }, [isUpdated]);

  const handleDateChange = (event) => {
    const date_selected = event.toDateString();

    dateContext.dispatch({
      type: "CHANGE_DATE",
      payload: { date: date_selected },
    });

    setIsUpdated(!isUpdated);
  };
  return (
    <Container>
      {dateContext.state.date ? (
        <Redirect to="/task_manager/cognitive" />
      ) : (
        <Calendar onChange={handleDateChange} />
      )}
    </Container>
  );
}
