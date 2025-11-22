CREATE TABLE IF NOT EXISTS links (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(16) NOT NULL UNIQUE,
    target_url TEXT NOT NULL,
    total_clicks INTEGER NOT NULL DEFAULT 0,
    last_clicked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_links_created_at
ON links (created_at DESC);

SELECT * FROM links LIMIT 5;
