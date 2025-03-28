/*
  # Create books table

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `author` (text, not null)
      - `genre` (text, not null)
      - `is_available` (boolean, not null)
      - `created_at` (timestamp with time zone, default: now())

  2. Security
    - Enable RLS on `books` table
    - Add policies for:
      - Anyone can read books
      - Authenticated users can insert books
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  genre text NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read books"
  ON books
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (true);