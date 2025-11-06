import { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'admin',
    hospital: '',
    orphanage: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Signup successful! Please login.');
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Signup for AdoptNow Admin / Hospital</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name</label><br />
        <input name="fullName" value={formData.fullName} onChange={handleChange} required /><br />

        <label>Email</label><br />
        <input name="email" type="email" value={formData.email} onChange={handleChange} required /><br />

        <label>Password</label><br />
        <input name="password" type="password" value={formData.password} onChange={handleChange} required /><br />

        <label>Role</label><br />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="admin">Orphanage Admin</option>
          <option value="hospital">Hospital Admin</option>
        </select><br />

        {formData.role === 'hospital' && (
          <>
            <label>Hospital Name</label><br />
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              placeholder="Enter hospital name"
              required
            /><br />
          </>
        )}

        {formData.role === 'admin' && (
          <>
            <label>Orphanage Name</label><br />
            <input
              type="text"
              name="orphanage"
              value={formData.orphanage}
              onChange={handleChange}
              placeholder="Enter orphanage name"
              required
            /><br />
          </>
        )}

        <button type="submit" style={{ marginTop: 10 }}>Signup</button>
      </form>
    </div>
  );
}
