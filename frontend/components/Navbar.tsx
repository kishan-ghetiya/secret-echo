import Link from 'next/link';
import { useAuth } from '../utils/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 bg-black text-white flex justify-between items-center">
      <Link href="/">SecretEcho</Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hi, {user.email}</span>
            <button onClick={logout} className="bg-red-600 px-4 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/signup" className="mr-4">Signup</Link>
            <Link href="/">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
