import { useAuth } from "../utils/AuthContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const userEmail = user?.email || 'Guest';

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {!user ? (
          <span className="title">Secret Echo</span>
        ) : (
          <>
            <div className="user-info">
              <span className="welcome-text">Welcome, {userEmail}!</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
