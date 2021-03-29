import React from "react";
import "./task_manager_cognitive.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import TodoComponent from "../components/todo";

export default function TaskManagerPage() {
  return (
    <Container fluid="lg">
      <h3>Task Manager</h3>

      <Row>
        <Col sm={12}>
          <Card style={{ padding: "1rem" }}>
            <Container fluid>
              <Row>
                <Col>
                  <h4>Mindfulness & Self-Love</h4>
                  <h5>Task Manager</h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TodoComponent />
                </Col>
                <Col>
                  <Row>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>Date</InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control type="date" />
                    </InputGroup>
                  </Row>
                  <Row>
                    <Card style={{ width: "100%", margin: "0.2rem auto" }}>
                      <Card.Body>
                        <Card.Title as="h6">
                          One thing I struggled with...
                        </Card.Title>
                        <Form.Control as="textarea" rows={2} />
                      </Card.Body>
                    </Card>
                  </Row>
                  <Row>
                    <Card style={{ width: "100%", margin: "0.2rem auto" }}>
                      <Card.Body>
                        <Card.Title as="h6">
                          One thing I feel proud of...
                        </Card.Title>
                        <Form.Control as="textarea" rows={2} />
                      </Card.Body>
                    </Card>
                  </Row>
                  <Row>
                    <Card style={{ width: "100%", margin: "0.2rem auto" }}>
                      <Card.Body>
                        <Card.Title as="h6">
                          One goal for tomorrow...
                        </Card.Title>
                        <Form.Control as="textarea" rows={2} />
                      </Card.Body>
                    </Card>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Card style={{ width: "100%", margin: "0.2rem auto" }}>
                  <Card.Body>
                    <Card.Title>Quote / Reflection of the Day</Card.Title>
                    <Form.Control as="textarea" rows={2} />
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          </Card>
        </Col>
        {/* <Col sm={2}>
          <Button type="submit">Save and Exit</Button>
        </Col> */}
      </Row>
    </Container>
  );
}
