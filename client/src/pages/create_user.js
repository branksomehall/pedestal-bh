import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export default function LoginPage() {
  const [alert, setAlert] = useState({
    state: false,
    variant: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const first_name = e.target.first_name.value;
    const last_name = e.target.last_name.value;
    const password = e.target.password.value;
    const email = e.target.email.value;
    const invitation_code = e.target.invitation_code.value;

    const payload = {
      first_name,
      last_name,
      email,
      password,
      invitation_code,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/signup`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      if (responseData.status === "error") {
        setAlert({
          state: true,
          variant: "danger",
          message: responseData.message,
        });
        setIsLoading(false);
        return;
      }
      const { user, token } = responseData;
      const tokenExpiration = new Date(new Date().getTime() + 1000 * 60 * 60);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: user,
          token,
          expiration: tokenExpiration.toISOString(),
        })
      );
      setAlert({
        state: true,
        variant: "success",
        message: "Successfully created an account",
      });
      setIsLoading(false);
    } catch (err) {}
  };

  return (
    <div>
      <Card style={{ width: "30rem", margin: "10vh auto" }}>
        <Card.Header>
          <Card.Title>Create Account</Card.Title>
        </Card.Header>
        <Form onSubmit={handleLogin}>
          <Card.Body>
            {alert.state && (
              <Alert variant={alert.variant}>{alert.message}</Alert>
            )}

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
            <Form.Group>
              <Form.Label>Invitation Code</Form.Label>
              <Form.Control type="text" name="invitation_code" />
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div>
                  {" "}
                  <Spinner animation="border" size="sm" /> Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
}
