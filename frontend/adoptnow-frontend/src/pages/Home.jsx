import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [stats, setStats] = useState({ hospitalCount: 0, orphanageCount: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/stats/counts')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats({ hospitalCount: 0, orphanageCount: 0 }));
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h1>🏠 Welcome to AdoptNow</h1>

      <section>
        <h2>About AdoptNow</h2>
        <p>
          AdoptNow connects hospitals, orphanages, and families to find loving homes for children.
          Our mission is to make adoption simpler, safer, and more transparent.
        </p>
      </section>

      <section>
        <h2>Our Network</h2>
        <p>Hospitals affiliated: {stats.hospitalCount}</p>
        <p>Orphanages affiliated: {stats.orphanageCount}</p>
      </section>

      <div style={{ marginTop: 50, textAlign: 'center' }}>
        <Link to="/contact" style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>
          📞 Contact Us
        </Link>
      </div>
    </div>
  );
}
