import { createContext } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  username: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export { AuthContext };
