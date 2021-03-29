import React, { useState, useContext } from "react";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHttpClient } from "../hooks/http-hook";
import { UserContext, DateContext } from "../context/app-contexts";

export default function TodoComponent() {
  const [tasks, setTasks] = useState([]);
  const { isLoading, error, sendRequest } = useHttpClient();
  const userContext = useContext(UserContext);
  const dateContext = useContext(DateContext);

  const handleAddTask = async (e) => {
    e.preventDefault();
    let newTaskList = [...tasks];
    const newTask = e.target.new_task_name.value;

    try {
      let payload = JSON.stringify({
        uid: userContext.userId,
        date: dateContext.state.date,
        task_name: newTask,
      });

      const responseData = await sendRequest(
        "http://localhost:5000/api/task_manager/tasks",
        "POST",
        payload,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userContext.token}`,
        }
      );
    } catch (err) {}

    e.target.new_task_name.value = "";

    newTaskList.push(newTask);

    setTasks(newTaskList);
  };

  return (
    <Card style={{ maxHeight: "500px", overflow: "auto" }}>
      <Card.Body>
        <h6 style={{ marginBottom: "2rem" }}>Tasks</h6>
        {tasks.map((task, idx) => {
          return (
            <InputGroup style={{ margin: "0.2rem auto" }} key={idx}>
              <InputGroup.Prepend>
                <InputGroup.Checkbox />
              </InputGroup.Prepend>
              <Form.Control type="text" value={task} readOnly />
            </InputGroup>
          );
        })}
        <Form onSubmit={handleAddTask}>
          <InputGroup style={{ margin: "0.2rem auto" }}>
            <InputGroup.Prepend>
              <Button variant="outline-secondary" type="submit">
                Add Task
              </Button>
            </InputGroup.Prepend>
            <Form.Control type="text" name="new_task_name" />
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
}
