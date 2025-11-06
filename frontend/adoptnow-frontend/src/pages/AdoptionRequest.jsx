// src/pages/AdoptionRequest.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdoptionRequest() {
  const { orphanId } = useParams(); // from URL like /adopt/:orphanId
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    adopterName: '',
    adopterEmail: '',
    adopterPhone: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await fetch('http://localhost:5000/api/adoptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, orphanId }),
      });
      if (res.ok) {
        setStatus('Adoption request submitted successfully!');
        // Optionally redirect user after delay
        setTimeout(() => navigate('/orphans'), 3000);
      } else {
        const data = await res.json();
        setStatus(data.message || 'Failed to submit request');
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Adoption Request Form</h2>
      {status && <p>{status}</p>}

      <form onSubmit={handleSubmit}>
        <label>Your Name</label><br />
        <input
          name="adopterName"
          value={formData.adopterName}
          onChange={handleChange}
          required
        /><br />

        <label>Your Email</label><br />
        <input
          name="adopterEmail"
          type="email"
          value={formData.adopterEmail}
          onChange={handleChange}
          required
        /><br />

        <label>Your Phone</label><br />
        <input
          name="adopterPhone"
          value={formData.adopterPhone}
          onChange={handleChange}
          required
        /><br />

        <label>Message (optional)</label><br />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
        /><br />

        <button type="submit" style={{ marginTop: 10 }}>Submit Request</button>
      </form>
    </div>
  );
}
