-- Create activity feed table
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX activity_feed_user_id_idx ON activity_feed(user_id);
CREATE INDEX activity_feed_timestamp_idx ON activity_feed(timestamp DESC);

-- Enable RLS for activity feed
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity feed
CREATE POLICY "Users can view their own activity"
ON activity_feed FOR SELECT
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Function to create activity
CREATE OR REPLACE FUNCTION create_activity(
  p_user_id UUID,
  p_type VARCHAR(50),
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO activity_feed (user_id, type, description, metadata)
  VALUES (p_user_id, p_type, p_description, p_metadata)
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;