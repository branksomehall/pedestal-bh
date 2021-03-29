import React from "react";

export const DateContext = React.createContext();

export const UserContext = React.createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const PageContext = React.createContext();
