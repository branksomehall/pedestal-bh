import React, { useContext } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useHttpClient } from "../hooks/http-hook";
import Alert from "react-bootstrap/Alert";
import { UserContext } from "../context/app-contexts";

export default function LoginPage() {
  const userContext = useContext(UserContext);
  const { isLoading, error, sendRequest } = useHttpClient();

  const handleLogin = async (e) => {
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, " ", password);
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/login",
        "POST",
        JSON.stringify({
          email,
          password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      userContext.token = responseData.token;
      userContext.userId = responseData.userId;

      const tokenExpiration = new Date(new Date().getTime() + 1000 * 60 * 60);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: responseData.userId,
          token: responseData.token,
          expiration: tokenExpiration.toISOString(),
        })
      );
    } catch (err) {}
  };
  return (
    <div>
      <Card style={{ width: "30rem", margin: "10vh auto" }}>
        <Card.Header>
          <Card.Title>Pedestal Login</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
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
