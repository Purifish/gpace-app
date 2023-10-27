import { createContext } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  userName: null,
  token: null,
  successMessage: "",
  login: () => {},
  logout: () => {},
  updateSuccessMessage: () => {},
});

export { AuthContext };
