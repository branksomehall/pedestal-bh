const AppReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_DATE":
      state.date = action.payload.date;
      return state;
    case "CLEAR_DATE":
      state.date = null;
      return state;
    default:
      return state;
  }
};

export default AppReducer;
