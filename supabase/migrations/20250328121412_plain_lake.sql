/*
  # Update books table policies

  1. Security Changes
    - Drop existing insert policy that requires authentication
    - Add new policy to allow public inserts
    
  Note: This is a temporary solution. In a production environment, you should implement proper authentication.
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Authenticated users can insert books" ON books;

-- Create a new policy that allows public inserts
CREATE POLICY "Anyone can insert books"
  ON books
  FOR INSERT
  TO public
  WITH CHECK (true);