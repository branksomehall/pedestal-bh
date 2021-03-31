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
    const dateFromSelection = new Date(event).toISOString();
    const dateISO = new Date(dateFromSelection.split("T")[0]);

    dateContext.dispatch({
      type: "CHANGE_DATE",
      payload: { date: dateISO },
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
