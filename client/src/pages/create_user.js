import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useHttpClient } from "../hooks/http-hook";

export default function LoginPage() {
  const { isLoading, error, sendRequest } = useHttpClient();

  const handleLogin = async (e) => {
    e.preventDefault();

    const first_name = e.target.first_name.value;
    const last_name = e.target.last_name.value;
    const password = e.target.password.value;
    const email = e.target.email.value;

    try {
      await sendRequest(
        "http://localhost:5000/api/users/signup",
        "POST",
        JSON.stringify({
          first_name,
          last_name,
          email,
          password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      // REDIRECT - LOGIN SUCCESS
    } catch (err) {}
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}

      <Card style={{ width: "30rem", margin: "10vh auto" }}>
        <Card.Header>
          <Card.Title>Create User</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="first_name" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="last_name" />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" />
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
