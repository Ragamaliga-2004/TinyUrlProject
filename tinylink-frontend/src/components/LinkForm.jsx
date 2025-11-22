// src/components/LinkForm.jsx
import React, { useState } from 'react';
import { createLink } from '../api';

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function LinkForm({ onLinkCreated }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  function validate() {
    if (!targetUrl.trim()) {
      setFieldError('Target URL is required.');
      return false;
    }

    if (customCode && !CODE_REGEX.test(customCode)) {
      setFieldError(
        'Custom code must be 6–8 characters (letters and numbers only).'
      );
      return false;
    }

    setFieldError(null);
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const isValid = validate();
    if (!isValid) return;

    try {
      setSubmitting(true);

      await createLink({
        targetUrl: targetUrl.trim(),
        customCode: customCode.trim() || undefined,
      });

      // Clear fields
      setTargetUrl('');
      setCustomCode('');
      setError(null);
      setFieldError(null);

      if (onLinkCreated) {
        onLinkCreated();
      }
    } catch (err) {
      console.error('Failed to create link', err);

      if (err.status === 409) {
        setError('This custom code is already in use. Try a different one.');
      } else if (err.status === 400) {
        // Our backend sends specific messages, reuse them if available
        setError(err.message || 'Invalid input. Please check the URL and code.');
      } else {
        setError('Something went wrong while creating the link. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="link-form card" onSubmit={handleSubmit}>
      <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>
        Create Short Link
      </h3>

      <div className="form-group">
        <label className="field-label" htmlFor="targetUrl">
          Target URL <span className="field-label__required">*</span>
        </label>
        <input
          id="targetUrl"
          type="url"
          className="field-input"
          placeholder="https://example.com/very/long/url"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label className="field-label" htmlFor="customCode">
          Custom code (optional)
        </label>
        <input
          id="customCode"
          type="text"
          className="field-input"
          placeholder="e.g. MyLink1"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          disabled={submitting}
        />
        <p className="field-help">
          6–8 characters. Letters and numbers only.
        </p>
      </div>

      {fieldError && (
        <p className="form-error">
          {fieldError}
        </p>
      )}

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Link'}
      </button>
    </form>
  );
}

export default LinkForm;
