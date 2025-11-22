// src/pages/StatsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLink, SHORT_BASE_URL } from '../api';

function StatsPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [copyError, setCopyError] = useState(null);

  const shortUrl = link ? `${SHORT_BASE_URL}/${link.code}` : '';

  async function fetchLink() {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setCopyError(null);

      const data = await getLink(code);
      setLink(data);
    } catch (err) {
      console.error('Failed to load link stats', err);

      if (err.status === 404) {
        setNotFound(true);
      } else {
        setError(err.message || 'Failed to load link stats.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function handleCopy() {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyError(null);
    } catch (err) {
      console.error('Failed to copy short URL', err);
      setCopyError('Failed to copy. Please copy manually.');
    }
  }

  function handleBack() {
    navigate('/');
  }

  return (
    <div className="stats-page">
      <h2 className="page-title">Link Stats</h2>

      {loading && (
        <div className="card stats-card">
          <p>Loading link statistics...</p>
        </div>
      )}

      {!loading && notFound && (
        <div className="card stats-card">
          <p style={{ marginBottom: '0.75rem' }}>
            Link not found or has been deleted.
          </p>
          <button type="button" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
      )}

      {!loading && !notFound && error && (
        <div className="card stats-card">
          <p
            style={{
              marginBottom: '0.75rem',
              color: '#dc2626',
            }}
          >
            {error}
          </p>
          <button type="button" onClick={fetchLink}>
            Retry
          </button>{' '}
          <button
            type="button"
            style={{ marginLeft: '0.5rem' }}
            onClick={handleBack}
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {!loading && !notFound && !error && link && (
        <div className="card stats-card">
          <div className="stats-section">
            <h3 className="stats-title">Short URL</h3>
            <div className="stats-shorturl">
              <code className="stats-shorturl__code">{shortUrl}</code>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCopy}
              >
                Copy
              </button>
            </div>
            {copyError && (
              <p className="form-error" style={{ marginTop: '0.25rem' }}>
                {copyError}
              </p>
            )}
          </div>

          <div className="stats-section">
            <h3 className="stats-title">Details</h3>
            <div className="stats-grid">
              <div className="stats-item">
                <div className="stats-label">Target URL</div>
                <div className="stats-value stats-url">
                  <a
                    href={link.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    title={link.targetUrl}
                  >
                    {link.targetUrl}
                  </a>
                </div>
              </div>

              <div className="stats-item">
                <div className="stats-label">Total Clicks</div>
                <div className="stats-value">
                  {link.totalClicks}
                </div>
              </div>

              <div className="stats-item">
                <div className="stats-label">Last Clicked</div>
                <div className="stats-value">
                  {link.lastClickedAt
                    ? new Date(link.lastClickedAt).toLocaleString()
                    : 'Never'}
                </div>
              </div>

              <div className="stats-item">
                <div className="stats-label">Created At</div>
                <div className="stats-value">
                  {link.createdAt
                    ? new Date(link.createdAt).toLocaleString()
                    : '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="stats-footer">
            <button type="button" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPage;
