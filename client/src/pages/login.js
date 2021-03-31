import React, { useContext, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { UserContext } from "../context/app-contexts";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const userContext = useContext(UserContext);
  const [alert, setAlert] = useState({
    state: false,
    variant: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("IN THE LOGIN");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;
    const payload = { email, password };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const responseData = await response.json();
      const tokenExpiration = new Date(new Date().getTime() + 1000 * 60 * 60);

      console.log(responseData);
      if (responseData.status === "error") {
        setAlert({
          state: true,
          variant: "danger",
          message: responseData.message,
        });
      } else {
        // Login was a success
        const token = responseData.token;
        const user = responseData.userId;

        userContext.token = token;
        userContext.user = user;
        userContext.isLoggedIn = true;
        await localStorage.setItem(
          "userData",
          JSON.stringify({
            userId: user,
            token: token,
            expiration: tokenExpiration.toISOString(),
          })
        );
        setAlert({
          state: true,
          variant: "success",
          message: "Email and Password are valid. Login success!",
        });
        userContext.authDispatch("LOGIN");
      }
    } catch (err) {}
  };
  return (
    <div>
      <Card style={{ width: "30rem", margin: "10vh auto" }}>
        <Card.Header>
          <Card.Title>Login</Card.Title>
        </Card.Header>
        <Form onSubmit={handleLogin}>
          <Card.Body>
            {alert.state && (
              <Alert variant={alert.variant}>{alert.message}</Alert>
            )}

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" />
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            {"  "}
            <Button
              as={Link}
              to="/signup"
              variant="outline"
              disabled={isLoading}
            >
              New User?
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
}
