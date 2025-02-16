import { createContext, useContext, useReducer } from "react";
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("unknown action type ");
  }
}
const initialState = {
  user: null,
  isAuthenticated: false,
};
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
const AuthContext = createContext();
function AuthContextProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContextProvider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContextProvider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === "undefined") {
    throw new Error("useAuth context was used outside Auth Provider");
  }
}
export { AuthContextProvider, useAuthContext };
