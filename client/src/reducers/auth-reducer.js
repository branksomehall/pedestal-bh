const AuthReducer = (isLoggedIn, action) => {
  switch (action) {
    case "LOGIN":
      isLoggedIn = true;
      return isLoggedIn;
    case "LOGOUT":
      localStorage.clear();
      isLoggedIn = false;
      return isLoggedIn;
    default:
      return isLoggedIn;
  }
};

export default AuthReducer;
