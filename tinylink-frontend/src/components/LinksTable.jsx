// src/components/LinksTable.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteLink, SHORT_BASE_URL } from '../api';

function LinksTable({ links, onDelete }) {
  const navigate = useNavigate();
  const [deletingCode, setDeletingCode] = useState(null);
  const [actionError, setActionError] = useState(null);

  async function handleCopy(shortUrl) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setActionError(null);
    } catch (err) {
      console.error('Failed to copy', err);
      setActionError('Failed to copy to clipboard. Please copy manually.');
    }
  }

  function handleStats(code) {
    navigate(`/code/${code}`);
  }

  async function handleDelete(code) {
    if (!window.confirm(`Delete link with code "${code}"?`)) {
      return;
    }

    try {
      setDeletingCode(code);
      setActionError(null);
      await deleteLink(code);

      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error('Failed to delete link', err);
      setActionError(
        err.message || 'Failed to delete link. Please try again.'
      );
    } finally {
      setDeletingCode(null);
    }
  }

  return (
    <div className="links-table-wrapper">
      {actionError && (
        <p className="form-error" style={{ marginBottom: '0.5rem' }}>
          {actionError}
        </p>
      )}

      <div className="links-table-scroll">
        <table className="links-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Target URL</th>
              <th>Total Clicks</th>
              <th>Last Clicked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((item) => {
              const shortUrl = `${SHORT_BASE_URL}/${item.code}`;
              const lastClicked = item.lastClickedAt
                ? new Date(item.lastClickedAt).toLocaleString()
                : '—';

              return (
                <tr key={item.code}>
                  <td>
                    <code>{item.code}</code>
                  </td>
                  <td className="links-table__target">
                    <span title={item.targetUrl}>{item.targetUrl}</span>
                  </td>
                  <td>{item.totalClicks}</td>
                  <td>{lastClicked}</td>
                  <td className="links-table__actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleCopy(shortUrl)}
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleStats(item.code)}
                    >
                      Stats
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(item.code)}
                      disabled={deletingCode === item.code}
                    >
                      {deletingCode === item.code ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LinksTable;
