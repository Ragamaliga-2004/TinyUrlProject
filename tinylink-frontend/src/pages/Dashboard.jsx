// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { listLinks } from '../api';
import LinkForm from '../components/LinkForm';
import LinksTable from '../components/LinksTable';

function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchLinks() {
    try {
      setLoading(true);
      setError(null);

      const data = await listLinks();
      setLinks(data);
    } catch (err) {
      console.error('Failed to load links', err);
      setError(err.message || 'Failed to load links');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="dashboard-page">
      <h2 className="page-title">Dashboard</h2>

      {/* Link creation form */}
      <LinkForm onLinkCreated={fetchLinks} />

      {/* Links list */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Your Links</h3>

        {loading && <p>Loading links...</p>}

        {!loading && error && (
          <div>
            <p style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
              {error}
            </p>
            <button type="button" onClick={fetchLinks}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && links.length === 0 && (
          <p>No links yet. Create one using the form above.</p>
        )}

        {!loading && !error && links.length > 0 && (
          <LinksTable links={links} onDelete={fetchLinks} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
