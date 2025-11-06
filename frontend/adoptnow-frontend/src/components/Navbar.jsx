import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: 10, borderBottom: '1px solid #ccc', marginBottom: 20 }}>
      <Link to="/" style={{ marginRight: 15, textDecoration: 'none' }}>🏠 Home</Link>
      <Link to="/login" style={{ marginRight: 15, textDecoration: 'none' }}>🔐 Login</Link>
      <Link to="/signup" style={{ marginRight: 15, textDecoration: 'none' }}>📝 Signup</Link>
      <Link to="/orphans" style={{ marginRight: 15, textDecoration: 'none' }}>👶 Orphans</Link>
    </nav>
  );
}
