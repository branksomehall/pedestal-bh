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

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const dateNow = new Date();
    const expirationDate = new Date(storedData?.expiration);

    console.log("Stored Data: ", storedData);
    console.log("EXPIRATION: ", expirationDate);
    console.log("Date now: ", dateNow);

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      // Execute login function (setToken and set UserId)
      setToken(storedData.token);
      setUserId(storedData.userId);
      authDispatch("LOGIN");
      console.log("logging in....");
    } else {
      console.log("token expired");

      localStorage.clear();
    }
  }, [isLoggedIn]);

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
                <Nav.Link as={Link} to="/signup">
                  Create User
                </Nav.Link>
                <Nav.Link as={Link} to="/selection">
                  Template Selection
                </Nav.Link>
                <Nav.Link as={Link} to="/task_manager/cognitive">
                  Cognitive Template
                </Nav.Link>
                <Nav.Link as={Link} to="/task_manager/mindfulness">
                  Mindfulness Template
                </Nav.Link>
                <Nav.Link as={Link} onClick={() => authDispatch("LOGOUT")}>
                  Logout
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          )}
        </Navbar>

        <UserContext.Provider
          value={{ isLoggedIn, userId, token, authDispatch }}
        >
          <Route exact={true} path="/">
            {isLoggedIn ? (
              <Redirect to="/calendar" />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact={true} path="/login">
            {isLoggedIn ? <Redirect to="/" /> : <LoginPage />}
          </Route>
          <Route exact={true} path="/signup">
            {isLoggedIn ? <Redirect to="/" /> : <SignUp />}
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

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
