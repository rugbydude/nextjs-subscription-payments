-- Add epic_id and tokens_used fields to stories table
ALTER TABLE stories
ADD COLUMN epic_id uuid REFERENCES epics(id),
ADD COLUMN tokens_used integer DEFAULT 0;
