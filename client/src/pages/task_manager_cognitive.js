import React, { useContext, useEffect, useState } from "react";
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
  const [dateSelected, setDateSelected] = useState();

  const [negativeThoughts, setNegativeThoughts] = useState();
  const [consequences, setConsequences] = useState();
  const [negativeToPositives, setNegativeToPositives] = useState();
  const [quote, setQuote] = useState();

  const { userId, token } = userContext;
  // Set Date for the task manager page based on context to update the form field
  useEffect(() => {
    const fullDate = new Date(dateContext.state.date).toISOString();
    const dateOnly = fullDate.split("T")[0];
    setDateSelected(dateOnly);

    // Create empty negative thoughts for user and date
    const initNegativeThoughts = async () => {
      try {
        const payload = {
          content: {
            item_1: " ",
            item_2: " ",
          },
          uid: userId,
          date: fullDate,
        };
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/task_manager/negative_thoughts/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        const responseData = await response.json();

        if (responseData.status !== "error") {
          setNegativeThoughts(responseData);
        }
      } catch (err) {
        console.log("ERROR: ", err);
      }
    };

    const initConsequences = async () => {};

    const initNegativeToPositives = async () => {};

    const initQuotes = async () => {};

    // Fetch negative thoughts for user and date
    const fetchNegativeThoughts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/task_manager/negative_thoughts/user/${userId}/date/${fullDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response.json();

      if (responseData.length > 0) {
        // if no negative thoughts have been generated, create a new one
        initNegativeThoughts();
      } else {
        setNegativeThoughts(responseData);
      }
    };

    fetchNegativeThoughts();
    // Fetch consequence for user and date

    // Fetch Negative To Positives for user and date

    // Fetch Quote for user and date
  }, [dateContext.state.date, userId]);

  const handleDateChange = (e) => {
    const dateFromSelection = new Date(e.target.value).toISOString();
    const dateOnly = dateFromSelection.split("T")[0];
    const dateISO = new Date(dateOnly);

    setDateSelected(dateOnly);

    dateContext.dispatch({
      type: "CHANGE_DATE",
      payload: { date: dateISO },
    });
  };

  const handleNegativeThoughtsUpdate = async (e, item, thoughtId) => {
    const itemKey = item;
    const thought = e.target.value;

    const payload = {
      content: {
        [itemKey]: thought,
      },
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/task_manager/negative_thoughts/${thoughtId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await response.json();

    setNegativeThoughts(responseData);
  };
  const handleConsequencesUpdate = async (e) => {};
  const handleNegativeToPositiveUpdate = async (e, item) => {};
  const handleQuoteUpdate = async (e) => {};

  return (
    <Container fluid="lg">
      <h3>Task Manager</h3>

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
                      <Form.Control
                        type="date"
                        value={dateSelected}
                        onChange={handleDateChange}
                      />
                    </InputGroup>
                  </Row>
                  <Row>
                    <Card style={{ width: "100%", margin: "0.2rem auto" }}>
                      <Card.Body>
                        <Card.Title as="h6">
                          Two negative thoughts I faced today...
                        </Card.Title>
                        {negativeThoughts && (
                          <div>
                            <InputGroup
                              style={{ margin: "0.5rem auto" }}
                              key={negativeThoughts._id + "-item_1"}
                            >
                              <InputGroup.Prepend>
                                <InputGroup.Text>1</InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                type="text"
                                onBlur={(e) =>
                                  handleNegativeThoughtsUpdate(
                                    e,
                                    "item_1",
                                    negativeThoughts._id
                                  )
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.target.blur();
                                  }
                                }}
                                defaultValue={negativeThoughts?.content?.item_1}
                              />
                            </InputGroup>
                            <InputGroup key={negativeThoughts._id + "-item_2"}>
                              <InputGroup.Prepend>
                                <InputGroup.Text>2</InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                type="text"
                                onBlur={(e) =>
                                  handleNegativeThoughtsUpdate(
                                    e,
                                    "item_2",
                                    negativeThoughts._id
                                  )
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.target.blur();
                                  }
                                }}
                                defaultValue={negativeThoughts?.content?.item_2}
                              />
                            </InputGroup>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Row>
                  <Row>
                    <Card style={{ width: "100%", margin: "0.2rem auto" }}>
                      <Card.Body>
                        <Card.Title as="h6">
                          Consequences of those thoughts were...
                        </Card.Title>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          onBlur={handleConsequencesUpdate}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.target.blur();
                            }
                          }}
                        />
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
                          <Form.Control
                            type="text"
                            onBlur={(e) =>
                              handleNegativeToPositiveUpdate(e, "item_1")
                            }
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.target.blur();
                              }
                            }}
                          />
                        </InputGroup>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <InputGroup.Text>2</InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                            type="text"
                            onBlur={(e) =>
                              handleNegativeToPositiveUpdate(e, "item_2")
                            }
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.target.blur();
                              }
                            }}
                          />
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
                    <Form.Control
                      as="textarea"
                      rows={2}
                      onBlur={handleQuoteUpdate}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.target.blur();
                        }
                      }}
                    />
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
