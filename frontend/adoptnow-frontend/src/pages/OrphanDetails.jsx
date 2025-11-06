import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function OrphanDetails() {
  const { id } = useParams();
  const [orphan, setOrphan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/children/${id}`)
      .then(res => res.json())
      .then(data => {
        setOrphan(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading orphan details...</p>;
  if (!orphan) return <p>Orphan not found.</p>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>{orphan.name} (Age: {orphan.age})</h2>
      <p><b>Location:</b> {orphan.location}</p>
      <p><b>Hospital:</b> {orphan.hospital || 'N/A'}</p>
      {orphan.photoUrl && (
        <img src={`http://localhost:5000/uploads/${orphan.photoUrl}`} alt={orphan.name} width="200" />
      )}

      <button onClick={() => navigate(`/chat/${orphan._id}`)} style={{ marginTop: 20 }}>
        Chat with Hospital
      </button>
    </div>
  );
}
