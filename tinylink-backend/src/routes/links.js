// src/routes/links.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Characters allowed in short codes
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;
const CODE_LENGTH = 6;
const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Helper: validate target URL
function validateTargetUrl(targetUrl) {
  if (!targetUrl) {
    const err = new Error('targetUrl is required');
    err.status = 400;
    throw err;
  }

  let url;
  try {
    url = new URL(targetUrl);
  } catch (e) {
    const err = new Error('Invalid URL format');
    err.status = 400;
    throw err;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    const err = new Error('URL must use http or https protocol');
    err.status = 400;
    throw err;
  }

  return targetUrl;
}

// Helper: validate custom code (if provided)
function validateCustomCode(customCode) {
  if (!customCode) return null;

  if (!CODE_REGEX.test(customCode)) {
    const err = new Error(
      'customCode must be 6–8 characters: letters and numbers only'
    );
    err.status = 400;
    throw err;
  }

  return customCode;
}

// Helper: generate random 6-char code
function generateRandomCode(length = CODE_LENGTH) {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * CODE_CHARS.length);
    code += CODE_CHARS[index];
  }
  return code;
}

// Helper: build base URL from request
function getBaseUrl(req) {
  const configured = process.env.BASE_URL;
  if (configured) return configured;
  return `${req.protocol}://${req.get('host')}`;
}

// Helper: map DB row to API response object
function mapRowToLink(row, baseUrl) {
  return {
    code: row.code,
    targetUrl: row.target_url,
    shortUrl: `${baseUrl}/${row.code}`,
    totalClicks: row.total_clicks,
    lastClickedAt: row.last_clicked_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * POST /api/links
 * Body: { targetUrl, customCode? }
 * Creates a new short link.
 */
router.post('/', async (req, res, next) => {
  try {
    const { targetUrl, customCode } = req.body || {};

    // Validate input
    const validTargetUrl = validateTargetUrl(targetUrl);
    const validCustomCode = validateCustomCode(customCode);

    // Ensure code (custom or generated) is unique
    let finalCode = validCustomCode;

    if (finalCode) {
      // Check if customCode already exists
      const existing = await query(
        'SELECT 1 FROM links WHERE code = $1 LIMIT 1',
        [finalCode]
      );

      if (existing.rowCount > 0) {
        const err = new Error('customCode already in use');
        err.status = 409;
        throw err;
      }
    } else {
      // Generate a unique random code
      const maxAttempts = 5;
      let attempts = 0;

      while (!finalCode) {
        const candidate = generateRandomCode(CODE_LENGTH);

        const existing = await query(
          'SELECT 1 FROM links WHERE code = $1 LIMIT 1',
          [candidate]
        );

        if (existing.rowCount === 0) {
          finalCode = candidate;
        } else {
          attempts += 1;
          if (attempts >= maxAttempts) {
            const err = new Error('Failed to generate unique code');
            err.status = 500;
            throw err;
          }
        }
      }
    }

    // Insert into DB
    const insertResult = await query(
      `
      INSERT INTO links (code, target_url)
      VALUES ($1, $2)
      RETURNING id, code, target_url, total_clicks, last_clicked_at, created_at, updated_at
      `,
      [finalCode, validTargetUrl]
    );

    const row = insertResult.rows[0];
    const baseUrl = getBaseUrl(req);
    const link = mapRowToLink(row, baseUrl);

    return res.status(201).json(link);
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/links
 * Lists all links ordered by created_at desc.
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      `
      SELECT id, code, target_url, total_clicks, last_clicked_at, created_at, updated_at
      FROM links
      ORDER BY created_at DESC
      `
    );

    const baseUrl = getBaseUrl(req);
    const links = result.rows.map((row) => mapRowToLink(row, baseUrl));

    return res.json(links);
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/links/:code
 * Fetch stats for a single code.
 */
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    // Optional: validate format
    if (!CODE_REGEX.test(code)) {
      return res.status(400).json({
        message: 'Invalid code format',
      });
    }

    const result = await query(
      `
      SELECT id, code, target_url, total_clicks, last_clicked_at, created_at, updated_at
      FROM links
      WHERE code = $1
      LIMIT 1
      `,
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Not found' });
    }

    const row = result.rows[0];
    const baseUrl = getBaseUrl(req);
    const link = mapRowToLink(row, baseUrl);

    return res.json(link);
  } catch (err) {
    return next(err);
  }
});

/**
 * DELETE /api/links/:code
 * Deletes a link by code.
 */
router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    // Optional: validate format
    if (!CODE_REGEX.test(code)) {
      return res.status(400).json({
        message: 'Invalid code format',
      });
    }

    const result = await query(
      'DELETE FROM links WHERE code = $1',
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Successful delete – 204 No Content
    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
