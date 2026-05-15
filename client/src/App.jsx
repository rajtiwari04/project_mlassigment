import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar    from "./components/Navbar";
import Landing   from "./pages/Landing";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Predict   from "./pages/Predict";
import History   from "./pages/History";
import About     from "./pages/About";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"          element={<Landing />}  />
          <Route path="/login"     element={<Login />}    />
          <Route path="/register"  element={<Register />} />
          <Route path="/about"     element={<About />}    />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/predict"   element={<PrivateRoute><Predict /></PrivateRoute>}   />
          <Route path="/history"   element={<PrivateRoute><History /></PrivateRoute>}   />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
