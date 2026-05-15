import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <Link to="/" className="flex items-center gap-2 font-bold text-green-700 text-xl">
        🌱 SoilSense
      </Link>

      <div className="flex items-center gap-5 text-sm font-medium">
        <Link to="/about" className="text-gray-600 hover:text-green-700 transition">About</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-green-700 transition">Dashboard</Link>
            <Link to="/history"   className="text-gray-600 hover:text-green-700 transition">History</Link>
            <Link to="/predict"   className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition">
              + Predict
            </Link>
            <span className="text-gray-400 text-xs">Hi, {user.name}</span>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="text-gray-600 hover:text-green-700 transition">Login</Link>
            <Link to="/register" className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
