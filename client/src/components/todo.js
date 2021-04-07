import React, { useState, useContext, useEffect } from "react";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { UserContext, DateContext } from "../context/app-contexts";

export default function TodoComponent(props) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useContext(UserContext);
  const dateContext = useContext(DateContext);

  // Pick up tasks on mount
  useEffect(() => {
    const date = new Date(dateContext.state.date).toISOString();
    fetch(`/api/task_manager/tasks/user/${userContext.userId}/date/${date}`, {
      headers: {
        Authorization: `Bearer ${userContext.token}`,
      },
    })
      .then((response) => response.text())
      .then((response) => {
        const taskList = JSON.parse(response);

        setTasks(taskList.tasks);
      });
  }, [dateContext.state.date, userContext]);

  useEffect(() => {
    setIsLoading(props.loading);
  }, [props.loading]);

  const handleAddTask = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const newTask = e.target.new_task_name.value;
    const date = new Date(dateContext.state.date).toISOString();
    let payload;

    try {
      payload = {
        uid: userContext.userId,
        date: date,
        task_name: newTask,
      };

      console.log("PAYLOAD: ", payload);
      const response = await fetch(`/api/task_manager/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.text())

        .catch((err) => console.log("ERR: ", err));
      const responseData = await JSON.parse(response);

      let newTaskList = [...tasks];
      newTaskList.push(responseData);

      setTasks(newTaskList);
      e.target.new_task_name.value = "";
      setIsLoading(false);
    } catch (err) {
      console.log("ERROR: ", err);
    }
  };

  const handleTaskComplete = async (e, task) => {
    const checkedStatus = e.target.checked;
    const taskId = task.id;

    const payload = { isCompleted: checkedStatus };

    fetch(`/api/task_manager/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify(payload),
    });
  };

  const handleTaskDelete = async (e, task) => {
    const taskId = task.id;

    setIsLoading(true);
    await fetch(`/api/task_manager/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userContext.token}`,
      },
    });

    let newTaskList = [...tasks];

    const foundTaskIndex = newTaskList.findIndex((task) => task.id === taskId);

    newTaskList.splice(foundTaskIndex, 1);

    setTasks(newTaskList);
    setIsLoading(false);
  };

  return (
    <Card style={{ maxHeight: "500px", overflow: "auto" }}>
      <Card.Body>
        <h6 style={{ marginBottom: "2rem" }}>Tasks</h6>
        {tasks?.map((task, idx) => {
          return (
            <InputGroup style={{ margin: "0.2rem auto" }} key={idx}>
              <InputGroup.Prepend>
                <InputGroup.Checkbox
                  onChange={(event) => handleTaskComplete(event, task)}
                  defaultChecked={task.isCompleted}
                />
              </InputGroup.Prepend>
              <Form.Control type="text" value={task.task_name} readOnly />
              <InputGroup.Append>
                <Button
                  variant="outline-danger"
                  onClick={(e) => handleTaskDelete(e, task)}
                >
                  -
                </Button>
              </InputGroup.Append>
            </InputGroup>
          );
        })}
        <Form onSubmit={handleAddTask}>
          <InputGroup style={{ margin: "0.2rem auto" }}>
            {isLoading ? (
              <InputGroup.Prepend>
                <Button variant="outline-secondary" disabled>
                  <Spinner size="sm" /> Loading...
                </Button>
              </InputGroup.Prepend>
            ) : (
              <InputGroup.Prepend>
                <Button variant="outline-secondary" type="submit">
                  Add Task
                </Button>
              </InputGroup.Prepend>
            )}

            <Form.Control
              type="text"
              name="new_task_name"
              disabled={isLoading}
            />
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
}
