/*
  # Add update and delete policies for books table

  1. Security Changes
    - Add policy to allow public updates
    - Add policy to allow public deletes
    
  Note: This is a temporary solution. In a production environment, you should implement proper authentication.
*/

-- Create policies for update and delete operations
CREATE POLICY "Anyone can update books"
  ON books
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete books"
  ON books
  FOR DELETE
  TO public
  USING (true);