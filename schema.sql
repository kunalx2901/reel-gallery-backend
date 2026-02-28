-- ============================================
-- Reel Gallery – PostgreSQL Schema
-- Run these queries once to set up your DB
-- ============================================

-- Enable pgcrypto for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------
-- Table: restaurants
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS restaurants (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name TEXT          NOT NULL,
  location        TEXT,
  description     TEXT,
  video_url       TEXT,
  thumbnail_url   TEXT,
  cuisine         TEXT,
  rating          DECIMAL(2,1)  DEFAULT 0.0,
  review_count    INTEGER       DEFAULT 0,
  price_range     TEXT,
  hours           TEXT,
  tags            TEXT[],
  chef            TEXT,
  established     TEXT,
  created_at      TIMESTAMP     DEFAULT NOW()
);

-- -----------------------------------------------
-- Table: reels
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS reels (
  id            UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID      NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  video_url     TEXT      NOT NULL,
  likes         INTEGER   DEFAULT 0,
  views         INTEGER   DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups by restaurant
CREATE INDEX IF NOT EXISTS idx_reels_restaurant_id ON reels(restaurant_id);
