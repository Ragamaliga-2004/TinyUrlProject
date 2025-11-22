// src/routes/redirect.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');

// same format rule as backend API: 6–8 alphanumeric
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

// GET /:code
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    // If the path segment doesn't look like a valid code,
    // treat it as "not found"
    if (!CODE_REGEX.test(code)) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Single SQL statement to update clicks and get target_url
    const result = await query(
      `
      UPDATE links
      SET
        total_clicks = total_clicks + 1,
        last_clicked_at = NOW(),
        updated_at = NOW()
      WHERE code = $1
      RETURNING target_url
      `,
      [code]
    );

    if (result.rowCount === 0) {
      // Code not found in DB
      return res.status(404).json({ message: 'Not found' });
    }

    const targetUrl = result.rows[0].target_url;

    // 302 redirect
    return res.redirect(302, targetUrl);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
