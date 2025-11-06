import { useEffect, useState } from 'react';

export default function Orphans() {
  const [orphans, setOrphans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPublicOrphans = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/children/public');
        const data = await res.json();

        if (res.ok) {
          setOrphans(data);
          setMessage('');
        } else {
          setMessage(data.message || 'Failed to fetch orphans');
        }
      } catch (err) {
        setMessage('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicOrphans();
  }, []);

  if (loading) return <p>Loading orphans...</p>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>👶 Orphans Available for Adoption</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      {orphans.length === 0 ? (
        <p>No orphans found.</p>
      ) : (
        <ul>
          {orphans.map((orphan) => (
            <li key={orphan._id} style={{ marginBottom: 20 }}>
              <b>{orphan.name}</b> — Age: {orphan.age} — Location: {orphan.location}
              {orphan.hospital && <div>Hospital: {orphan.hospital}</div>}
              <br />
              {orphan.photoUrl && (
                <img
                  src={`http://localhost:5000/uploads/${orphan.photoUrl}`}
                  alt={orphan.name}
                  width="120"
                  style={{ marginTop: 8, borderRadius: 6 }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
