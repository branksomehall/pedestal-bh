import React, { useReducer, useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import CalendarPage from "./pages/calendar";
import LoginPage from "./pages/login";
import SignUp from "./pages/create_user";
import SelectionPage from "./pages/selection";
import TaskManagerCognitivePage from "./pages/task_manager_cognitive";
import TaskManagerMindfulnessPage from "./pages/task_manager_mindfulness";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "bootstrap/dist/css/bootstrap.min.css";

import AppReducer from "./reducers/app-reducer";
import AuthReducer from "./reducers/auth-reducer";
import { DateContext, UserContext } from "./context/app-contexts";

function App() {
  const [state, dispatch] = useReducer(AppReducer, {
    date: null,
    user: null,
  });

  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [isLoggedIn, authDispatch] = useReducer(AuthReducer, false);
  const [updateToken, setUpdateToken] = useState(false);
  const [userClass, setUserClass] = useState();
  const [refreshToken, setRefreshToken] = useState(false);

  let storedData = JSON.parse(localStorage.getItem("userData"));
  const dateNow = new Date();
  const expirationDate = new Date(storedData?.expiration);
  const expires_in = storedData?.expires_in;
  useEffect(() => {
    if (storedData && storedData.token && expirationDate > dateNow) {
      // Execute login function (setToken and set UserId)
      setToken(storedData.token);
      setUserId(storedData.userId);
      setRefreshToken(storedData.refresh_token);
      setUserClass(storedData.user_class);
      authDispatch("LOGIN");
    } else {
      localStorage.clear();
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    setTimeout(() => {
      setUpdateToken(!updateToken);
    }, expires_in);
  }

  useEffect(() => {
    // Fetch refresh token and update token in storage
    if (isLoggedIn) {
      const refresh_token = JSON.parse(localStorage.getItem("userData"))
        ?.refresh_token;
      const payload = { refresh_token };

      fetch(`/api/users/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.text())
        .then((data) => {
          const userData = JSON.parse(data);
          const newUserData = {
            ...JSON.parse(localStorage.getItem("userData")),
            token: userData.token,
          };
          //update local storage with new token
          localStorage.setItem("userData", JSON.stringify(newUserData));

          //update context with new token
          setToken(userData.token);
        });
    }
  }, [updateToken]);

  const handleLogout = () => {
    const payload = {
      token: refreshToken,
    };
    console.log("DELETING: ", payload);
    fetch(`/api/users/token`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    authDispatch("LOGOUT");
  };

  return (
    <div>
      <Router>
        <Navbar bg="dark" variant="dark" style={{ marginBottom: "2rem" }}>
          <Navbar.Brand>Pedestal</Navbar.Brand>
          {isLoggedIn && (
            <Navbar.Collapse>
              <Nav>
                <Nav.Link
                  as={Link}
                  to="/calendar"
                  onClick={() => dispatch({ type: "CLEAR_DATE" })}
                >
                  Calendar
                </Nav.Link>
                {userClass && userClass === "admin" && (
                  <Nav.Link as={Link} to="/signup">
                    Create User
                  </Nav.Link>
                )}

                {/* <Nav.Link as={Link} to="/selection">
                  Template Selection
                </Nav.Link>
                <Nav.Link as={Link} to="/task_manager/cognitive">
                  Cognitive Template
                </Nav.Link>
                <Nav.Link as={Link} to="/task_manager/mindfulness">
                  Mindfulness Template
                </Nav.Link> */}
                <Nav.Link onClick={() => handleLogout()}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          )}
        </Navbar>

        <UserContext.Provider
          value={{ isLoggedIn, userId, token, authDispatch, userClass }}
        >
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

          <Route exact={true} path="/login">
            <LoginPage />
          </Route>

          <Route exact={true} path="/signup">
            <SignUp />
          </Route>

          <Route exact={true} path="/selection">
            {isLoggedIn ? <SelectionPage /> : <Redirect to="/" />}
          </Route>

          <DateContext.Provider value={{ dispatch, state }}>
            <Route exact={true} path="/calendar">
              {isLoggedIn ? <CalendarPage /> : <Redirect to="/" />}
            </Route>
            <Route exact={true} path="/task_manager/cognitive">
              {isLoggedIn ? <TaskManagerCognitivePage /> : <Redirect to="/" />}
            </Route>
            <Route exact={true} path="/task_manager/mindfulness">
              {isLoggedIn ? (
                <TaskManagerMindfulnessPage />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
          </DateContext.Provider>

          <Route path="/*">
            {isLoggedIn ? (
              <Redirect to="/calendar" />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
