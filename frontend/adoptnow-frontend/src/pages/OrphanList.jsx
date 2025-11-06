import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrphanList() {
  const [orphans, setOrphans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    ageGroup: '',
    location: '',
    search: '',
    sortBy: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/children/public')
      .then(res => res.json())
      .then(data => {
        setOrphans(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = orphans.filter(o => {
    const ageMatch =
      filters.ageGroup === 'child' ? o.age < 12 :
      filters.ageGroup === 'teen' ? o.age >= 12 && o.age <= 18 :
      true;

    const locMatch = o.location?.toLowerCase().includes(filters.location.toLowerCase());
    const nameMatch = o.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                      (o.hospital?.toLowerCase().includes(filters.search.toLowerCase()));

    return ageMatch && locMatch && nameMatch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (filters.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  if (loading) return <p>Loading orphans...</p>;

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>👶 Orphans Available for Adoption</h2>

      <div style={{ marginBottom: 20 }}>
        <label>
          Age Group:
          <select value={filters.ageGroup} onChange={e => setFilters({...filters, ageGroup: e.target.value})}>
            <option value="">All</option>
            <option value="child">Child (0–11)</option>
            <option value="teen">Teen (12–18)</option>
          </select>
        </label>

        <label style={{ marginLeft: 20 }}>
          Location:
          <input
            type="text"
            placeholder="e.g. Hyderabad"
            value={filters.location}
            onChange={e => setFilters({...filters, location: e.target.value})}
          />
        </label>

        <label style={{ marginLeft: 20 }}>
          Search by Name/Hospital:
          <input
            type="text"
            placeholder="e.g. Care Hospital"
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
        </label>

        <label style={{ marginLeft: 20 }}>
          Sort:
          <select value={filters.sortBy} onChange={e => setFilters({...filters, sortBy: e.target.value})}>
            <option value="">None</option>
            <option value="newest">Recently Added</option>
          </select>
        </label>
      </div>

      {sorted.length === 0 ? (
        <p>No orphans found with your filters.</p>
      ) : (
        <ul>
          {sorted.map(o => (
            <li key={o._id} style={{ border: '1px solid #ccc', padding: 15, marginBottom: 10 }}>
              <h3>{o.name} (Age: {o.age})</h3>
              <p>Location: {o.location}</p>
              <p>Hospital: {o.hospital || 'N/A'}</p>
              <button onClick={() => navigate(`/orphans/${o._id}`)}>
                View Details & Chat
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
