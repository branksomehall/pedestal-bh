import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SelectionPage() {
  const handleTaskManagerSelection = (e) => {
    e.preventDefault();
  };
  return (
    <Container>
      <Card>
        <Card.Header>
          <Card.Title>Choose your template for [date]</Card.Title>
        </Card.Header>
        <Form onSubmit={handleTaskManagerSelection}>
          <Card.Body>
            <Form.Group>
              <Form.Label as="h3">Task Managers</Form.Label>
              <Form.Check
                type="radio"
                label="Cognitive Behavioural Therapy"
                id="cognitive"
                name="task_manager_template"
              />

              <Form.Check
                type="radio"
                label="Mindfulness & Self-Love"
                id="mindfulness"
                name="task_manager_template"
              />
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <Button type="submit"> Done</Button>
          </Card.Footer>
        </Form>
      </Card>
    </Container>
  );
}
