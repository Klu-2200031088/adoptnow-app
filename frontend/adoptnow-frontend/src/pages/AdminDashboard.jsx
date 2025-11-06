import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [orphans, setOrphans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // fetchOrphans wrapped in useCallback so it can be safely used in useEffect deps
  const fetchOrphans = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/children', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrphans(data);
        setMessage('');
      } else {
        setMessage(data.message || 'Failed to fetch orphans');
      }
    } catch (err) {
      setMessage('Error loading orphans: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch orphans on mount or token change
  useEffect(() => {
    if (token) {
      fetchOrphans();
    }
  }, [token, fetchOrphans]);

  // Add new orphan
  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('location', location);
    if (photoFile) formData.append('photo', photoFile);

    try {
      const res = await fetch('http://localhost:5000/api/children', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Orphan added!');
        setName('');
        setAge('');
        setLocation('');
        setPhotoFile(null);
        fetchOrphans(); // Refresh orphan list
      } else {
        setMessage(data.message || 'Failed to add orphan');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  // Delete orphan
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/children/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setOrphans((prev) => prev.filter((o) => o._id !== id));
        setMessage('🗑️ Orphan deleted');
      } else {
        setMessage('Failed to delete orphan');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  if (loading) return <p>Loading orphans...</p>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>⚙️ Admin Dashboard - Manage Orphans</h2>
      {message && (
        <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}

      <h3>Add New Orphan</h3>
      <form onSubmit={handleAdd} encType="multipart/form-data">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          style={{ marginRight: 10, width: 80 }}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={{ marginRight: 10 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
          style={{ marginRight: 10 }}
        />
        <button type="submit">➕ Add Orphan</button>
      </form>

      <h3 style={{ marginTop: 30 }}>📋 My Orphans</h3>
      {orphans.length === 0 ? (
        <p>No orphans found.</p>
      ) : (
        <ul>
          {orphans.map((orphan) => (
            <li key={orphan._id} style={{ marginBottom: 20 }}>
              <b>{orphan.name}</b> — Age: {orphan.age} — Location: {orphan.location}
              <br />
              {orphan.photoUrl && (
                <img
                  src={`http://localhost:5000/uploads/${orphan.photoUrl}`}
                  alt={orphan.name}
                  width="120"
                  style={{ marginTop: 8, borderRadius: 6 }}
                />
              )}
              <br />
              <button
                onClick={() => handleDelete(orphan._id)}
                style={{
                  marginTop: 5,
                  color: 'white',
                  backgroundColor: 'red',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: 4,
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
