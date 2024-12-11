-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'employee')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_user_id UUID REFERENCES users(id),
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed')),
  points INTEGER NOT NULL CHECK (points >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Points history table
CREATE TABLE points_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  points INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create view for leaderboard
CREATE VIEW leaderboard AS
SELECT 
  u.id AS user_id,
  u.name AS user_name,
  u.avatar_url,
  COALESCE(SUM(ph.points), 0) AS total_points,
  RANK() OVER (ORDER BY COALESCE(SUM(ph.points), 0) DESC) AS rank
FROM users u
LEFT JOIN points_history ph ON u.id = ph.user_id
GROUP BY u.id, u.name, u.avatar_url;

-- Function to update task status
CREATE OR REPLACE FUNCTION update_task_status(
  task_id UUID,
  new_status VARCHAR(50)
) RETURNS void AS $$
BEGIN
  UPDATE tasks
  SET 
    status = new_status,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;

-- Function to award points
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_task_id UUID,
  p_points INTEGER,
  p_reason VARCHAR(255)
) RETURNS void AS $$
BEGIN
  INSERT INTO points_history (user_id, task_id, points, reason)
  VALUES (p_user_id, p_task_id, p_points, p_reason);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data and admins can view all"
ON users FOR SELECT
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Tasks are viewable by assigned user and admins"
ON tasks FOR SELECT
USING (
  auth.uid() = assigned_user_id OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Points history is viewable by the user and admins"
ON points_history FOR SELECT
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Insert sample data
INSERT INTO users (name, email, role) VALUES
('Admin User', 'admin@example.com', 'admin'),
('John Doe', 'john@example.com', 'employee'),
('Jane Smith', 'jane@example.com', 'employee');

INSERT INTO tasks (title, description, assigned_user_id, deadline, status, points) 
SELECT 
  'Complete Project Milestone',
  'Finish the first phase of the project implementation',
  id,
  CURRENT_TIMESTAMP + INTERVAL '7 days',
  'in-progress',
  100
FROM users WHERE email = 'john@example.com';