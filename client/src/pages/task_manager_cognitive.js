import React, { useContext, useEffect, useState } from "react";
import "./task_manager_cognitive.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import { DateContext, UserContext } from "../context/app-contexts";

import TodoComponent from "../components/todo";

export default function TaskManagerPage() {
  const userContext = useContext(UserContext);
  const dateContext = useContext(DateContext);
  const [dateSelected, setDateSelected] = useState();
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [negativeThoughts, setNegativeThoughts] = useState({
    content: {
      item_1: "",
      item_2: "",
    },
  });
  const [consequence, setConsequence] = useState({
    content: "",
  });
  const [negativeToPositives, setNegativeToPositives] = useState({
    content: {
      item_1: "",
      item_2: "",
    },
  });
  const [quote, setQuote] = useState({
    content: "",
  });

  const { userId, token } = userContext;

  // Set Date for the task manager page based on context to update the form field
  useEffect(() => {
    const fullDate = new Date(dateContext.state.date).toISOString();
    const dateOnly = fullDate.split("T")[0];

    setDateSelected(dateOnly);

    // Fetch negative thoughts for user and date, if empty render empty table if exists render thoughts
    const fetchNegativeThoughts = async (date) => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/task_manager/negative_thoughts/user/${userId}/date/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch((error) => console.log(error));

      const responseData = await response.json();

      if (responseData.status !== "error") {
        // if not an error
        setNegativeThoughts(responseData);
      } else {
        setNegativeThoughts({ content: { item_1: "", item_2: "" } });
      }
    };

    // Fetch consequence for user and date
    const fetchConsequence = async (date) => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/task_manager/consequences/user/${userId}/date/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch((error) => console.log(error));

      const responseData = await response.json();

      if (responseData.status !== "error") {
        setConsequence(responseData);
      } else {
        setConsequence({ content: "" });
      }
    };

    // Fetch Negative To Positives for user and date
    const fetchNegativeToPositives = async (date) => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/task_manager/negative_to_positives/user/${userId}/date/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch((error) => console.log(error));
      const responseData = await response.json();

      if (responseData.status !== "error") {
        setNegativeToPositives(responseData);
      } else {
        setNegativeToPositives({ content: { item_1: "", item_2: "" } });
      }
    };

    // Fetch Quote for user and date
    const fetchQuote = async (date) => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/task_manager/quotes/user/${userId}/date/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch((error) => console.log(error));
      const responseData = await response.json();

      if (responseData.status !== "error") {
        setQuote(responseData);
      } else {
        setQuote({ content: "" });
      }
    };

    setIsLoading(true);
    fetchNegativeThoughts(dateOnly);
    fetchConsequence(dateOnly);
    fetchNegativeToPositives(dateOnly);
    fetchQuote(dateOnly);
    setIsLoading(false);
    return;
  }, [dateContext.state.date, userId, token, isUpdated]);

  const handleDateChange = async (e) => {
    setIsLoading(true);
    const dateFromSelection = new Date(e.target.value).toISOString();
    const dateOnly = dateFromSelection.split("T")[0];
    const dateISO = new Date(dateOnly);

    await setDateSelected(dateOnly);

    await dateContext.dispatch({
      type: "CHANGE_DATE",
      payload: { date: dateISO },
    });
    setIsUpdated(!isUpdated);
    setIsLoading(false);
  };

  const handleNegativeThoughtsFormUpdate = async (e) => {
    let content = e.target.value;

    if (!content) {
      content = " ";
    }

    const payload = {
      content: {
        [e.target.name]: content,
      },
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/task_manager/negative_thoughts/user/${userId}/date/${dateSelected}`,
      {
        method: "PUT",
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
  const handleConsequencesUpdate = async (e) => {
    let content = e.target.value;

    if (!content) {
      content = " ";
    }

    const payload = {
      content,
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/task_manager/consequences/user/${userId}/date/${dateSelected}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await response.json();

    setConsequence(responseData);
  };
  const handleNegativeToPositiveFormUpdate = async (e) => {
    const fullDate = new Date(dateContext.state.date).toISOString();
    const dateOnly = fullDate.split("T")[0];

    const item_key = e.target.name.split("-")[1];

    const payload = {
      content: {
        [item_key]: e.target.value,
      },
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/task_manager/negative_to_positives/user/${userId}/date/${dateOnly}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await response.json();

    setNegativeToPositives(responseData);
  };
  const handleQuoteUpdate = async (e) => {
    let content = e.target.value;

    if (!content) {
      content = " ";
    }

    const payload = {
      content,
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/task_manager/quotes/user/${userId}/date/${dateSelected}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await response.json();
    setQuote(responseData);
  };

  return (
    <Container fluid="lg">
      <Row>
        <Col sm={12}>
          <Card style={{ padding: "1rem" }}>
            <Container fluid>
              <Row>
                <Col>
                  <h4>Cognitive Behavioural Therapy</h4>
                  <h5>Task Manager </h5>
                </Col>
                <Col>
                  {isLoading && (
                    <Alert variant="info">
                      <Spinner animation="grow" variant="info" size="sm" />{" "}
                      Updating. Please wait ...
                    </Alert>
                  )}
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
                        disabled={isLoading}
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
                          <Form
                            onBlur={(e) => handleNegativeThoughtsFormUpdate(e)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.target.blur();
                              }
                            }}
                          >
                            <InputGroup
                              style={{ margin: "0.5rem auto" }}
                              key={`${negativeThoughts.content.item_1}-neg-item_1`}
                            >
                              <InputGroup.Prepend>
                                <InputGroup.Text>1</InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                type="text"
                                defaultValue={negativeThoughts.content.item_1}
                                name="item_1"
                                disabled={isLoading}
                              />
                            </InputGroup>
                            <InputGroup
                              key={`${negativeThoughts.content.item_2}-neg-item_2`}
                            >
                              <InputGroup.Prepend>
                                <InputGroup.Text>2</InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                type="text"
                                defaultValue={negativeThoughts.content.item_2}
                                name="item_2"
                                disabled={isLoading}
                              />
                            </InputGroup>
                          </Form>
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
                        {consequence && (
                          <Form
                            onBlur={handleConsequencesUpdate}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.target.blur();
                              }
                            }}
                            key={`${consequence.content}-${dateSelected}`}
                          >
                            <Form.Control
                              disabled={isLoading}
                              as="textarea"
                              rows={3}
                              name="consequences"
                              defaultValue={consequence.content}
                            />
                          </Form>
                        )}
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
                        <Form
                          onBlur={(e) => handleNegativeToPositiveFormUpdate(e)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.target.blur();
                            }
                          }}
                          disabled={isLoading}
                        >
                          {negativeToPositives && (
                            <div>
                              <InputGroup
                                style={{ margin: "0.5rem auto" }}
                                key={`${negativeToPositives.content.item_1}-n2p-item_1`}
                              >
                                <InputGroup.Prepend>
                                  <InputGroup.Text>1</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                  type="text"
                                  defaultValue={
                                    negativeToPositives.content.item_1
                                  }
                                  name="n2p-item_1"
                                  disabled={isLoading}
                                />
                              </InputGroup>
                              <InputGroup
                                key={`${negativeToPositives.content.item_2}-n2p-item_2`}
                              >
                                <InputGroup.Prepend>
                                  <InputGroup.Text>2</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                  type="text"
                                  defaultValue={
                                    negativeToPositives.content.item_2
                                  }
                                  name="n2p-item_2"
                                  disabled={isLoading}
                                />
                              </InputGroup>
                            </div>
                          )}
                        </Form>
                      </Card.Body>
                    </Card>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Card style={{ width: "100%", margin: "0.2rem auto" }}>
                  <Card.Body>
                    <Card.Title>Quote / Reflection of the Day</Card.Title>
                    {quote && (
                      <Form
                        onBlur={handleQuoteUpdate}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.target.blur();
                          }
                        }}
                        key={`${quote.content}-${dateSelected}`}
                      >
                        <Form.Control
                          as="textarea"
                          rows={2}
                          defaultValue={quote.content}
                          disabled={isLoading}
                        />
                      </Form>
                    )}
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
