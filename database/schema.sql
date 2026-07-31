-- ===================================================
-- CampusCare AI Database Schema
-- Compatible with PostgreSQL, MySQL, and SQLite
-- ===================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('student', 'technician', 'dept_head', 'admin')),
    phone VARCHAR(32),
    avatar_url VARCHAR(256),
    department_id VARCHAR(64),
    specialization TEXT, -- JSON array of category names
    rating DECIMAL(3, 2) DEFAULT 5.0,
    completed_jobs INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(32) UNIQUE NOT NULL,
    head_name VARCHAR(128),
    head_email VARCHAR(128),
    active_techs INT DEFAULT 0,
    open_tickets INT DEFAULT 0,
    avg_resolution_hours DECIMAL(5, 2) DEFAULT 4.0,
    sla_compliance_rate DECIMAL(5, 2) DEFAULT 95.0
);

-- 3. BUILDINGS TABLE
CREATE TABLE IF NOT EXISTS buildings (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(32) UNIQUE NOT NULL,
    x_coord INT NOT NULL, -- Map Canvas X%
    y_coord INT NOT NULL, -- Map Canvas Y%
    total_rooms INT DEFAULT 50,
    active_issues_count INT DEFAULT 0,
    health_score INT DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
    density_status VARCHAR(16) DEFAULT 'low' CHECK (density_status IN ('low', 'moderate', 'high'))
);

-- 4. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(64) PRIMARY KEY,
    tracking_number VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    subcategory VARCHAR(64),
    priority VARCHAR(32) NOT NULL CHECK (priority IN ('P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW')),
    status VARCHAR(32) NOT NULL DEFAULT 'submitted',
    student_id VARCHAR(64) NOT NULL REFERENCES users(id),
    student_name VARCHAR(128) NOT NULL,
    building_id VARCHAR(64) NOT NULL REFERENCES buildings(id),
    building_name VARCHAR(128) NOT NULL,
    floor VARCHAR(32),
    room_number VARCHAR(32),
    department_id VARCHAR(64) REFERENCES departments(id),
    department_name VARCHAR(128),
    technician_id VARCHAR(64) REFERENCES users(id),
    technician_name VARCHAR(128),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_deadline TIMESTAMP NOT NULL,
    resolution_deadline TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    resolution_notes TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    is_escalated BOOLEAN DEFAULT FALSE,
    escalation_reason TEXT,
    ai_summary TEXT,
    sentiment VARCHAR(32) DEFAULT 'Neutral',
    upvotes_count INT DEFAULT 1
);

-- 5. TIMELINE EVENTS TABLE
CREATE TABLE IF NOT EXISTS timeline_events (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(128) NOT NULL,
    actor_role VARCHAR(32) NOT NULL
);

-- 6. ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS attachments (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    file_name VARCHAR(256) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(32) CHECK (file_type IN ('image', 'video', 'pdf', 'document')),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. SLA CONFIGS TABLE
CREATE TABLE IF NOT EXISTS sla_configs (
    category VARCHAR(64) PRIMARY KEY,
    p1_response_hours INT NOT NULL,
    p1_resolution_hours INT NOT NULL,
    p2_response_hours INT NOT NULL,
    p2_resolution_hours INT NOT NULL,
    p3_response_hours INT NOT NULL,
    p3_resolution_hours INT NOT NULL,
    p4_response_hours INT NOT NULL,
    p4_resolution_hours INT NOT NULL
);

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(128) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL,
    target VARCHAR(128) NOT NULL,
    details TEXT
);
