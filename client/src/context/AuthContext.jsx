import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const BASE = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const save = (tok, usr) => {
    setToken(tok);
    setUser(usr);
    localStorage.setItem("token", tok);
    axios.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${BASE}/auth/login`, { email, password });
    save(data.token, data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${BASE}/auth/register`, { name, email, password });
    save(data.token, data.user);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
