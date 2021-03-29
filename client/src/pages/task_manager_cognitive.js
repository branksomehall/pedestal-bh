import React, { useContext } from "react";
import "./task_manager_cognitive.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { DateContext, UserContext } from "../context/app-contexts";

import TodoComponent from "../components/todo";

export default function TaskManagerPage() {
  const userContext = useContext(UserContext);
  const dateContext = useContext(DateContext);
  return (
    <Container fluid="lg">
      <h3>Task Manager</h3>
      <h4>User: {userContext.user}</h4>
      <h4>Date: {dateContext.state.date}</h4>
      <h4>User ID: {userContext.userId}</h4>
      <Row>
        <Col sm={12}>
          <Card style={{ padding: "1rem" }}>
            <Container fluid>
              <Row>
                <Col>
                  <h4>Cognitive Behavioural Therapy</h4>
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
                          Two negative thoughts I faced today...
                        </Card.Title>
                        <InputGroup style={{ margin: "0.5rem auto" }}>
                          <InputGroup.Prepend>
                            <InputGroup.Text>1</InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control type="text" />
                        </InputGroup>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <InputGroup.Text>2</InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control type="text" />
                        </InputGroup>
                      </Card.Body>
                    </Card>
                  </Row>
                  <Row>
                    <Card style={{ width: "100%", margin: "0.2rem auto" }}>
                      <Card.Body>
                        <Card.Title as="h6">
                          Consequences of those thoughts were...
                        </Card.Title>
                        <Form.Control as="textarea" rows={3} />
                      </Card.Body>
                    </Card>
                  </Row>
                  <Row>
                    <Card style={{ width: "100%", margin: "0.2rem auto" }}>
                      <Card.Body>
                        <Card.Title as="h6">
                          Two things I did to transform negativity into
                          positivity!
                        </Card.Title>
                        <InputGroup style={{ margin: "0.5rem auto" }}>
                          <InputGroup.Prepend>
                            <InputGroup.Text>1</InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control type="text" />
                        </InputGroup>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <InputGroup.Text>2</InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control type="text" />
                        </InputGroup>
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
