-- ===================================================
-- CampusCare AI Initial Seed Data
-- ===================================================

-- Seed Departments
INSERT INTO departments (id, name, code, head_name, head_email, active_techs, open_tickets, avg_resolution_hours, sla_compliance_rate) VALUES
('dept_elec', 'Electrical Maintenance', 'ELEC-DEPT', 'Dr. Meera Nambiar', 'meera.head@campus.edu', 5, 8, 3.5, 96.2),
('dept_it', 'IT & Infrastructure', 'IT-DEPT', 'Prof. Sunita Rao', 'sunita.it@campus.edu', 7, 12, 2.8, 98.1),
('dept_plumb', 'Plumbing & Facilities', 'PLUMB-DEPT', 'Eng. Suresh Menon', 'suresh.plumb@campus.edu', 4, 6, 4.1, 91.5);

-- Seed Buildings
INSERT INTO buildings (id, name, code, x_coord, y_coord, total_rooms, active_issues_count, health_score, density_status) VALUES
('b1', 'Tech Hub CS Block', 'CS-TH', 25, 35, 60, 4, 88, 'moderate'),
('b2', 'Central Auditorium', 'AUD-MAIN', 60, 25, 20, 7, 65, 'high'),
('b3', 'Academic Block A', 'ACA-A', 40, 70, 45, 2, 94, 'low'),
('b4', 'Hostel Complex H3', 'HST-H3', 75, 75, 120, 5, 79, 'moderate');

-- Seed Users
INSERT INTO users (id, name, email, role, phone, department_id, rating) VALUES
('usr_student_1', 'Aarav Sharma', 'aarav.sharma@campus.edu', 'student', '+91-9876543210', NULL, 5.0),
('usr_tech_1', 'Vikram Singh', 'vikram.tech@campus.edu', 'technician', '+91-9876543211', 'dept_elec', 4.9),
('usr_head_1', 'Dr. Meera Nambiar', 'meera.head@campus.edu', 'dept_head', '+91-9876543212', 'dept_elec', 5.0),
('usr_admin_1', 'Dean Rajesh Kumar', 'admin@campus.edu', 'admin', '+91-9876543213', NULL, 5.0);

-- Seed SLA Configs
INSERT INTO sla_configs (category, p1_response_hours, p1_resolution_hours, p2_response_hours, p2_resolution_hours, p3_response_hours, p3_resolution_hours, p4_response_hours, p4_resolution_hours) VALUES
('Electrical', 1, 4, 4, 12, 8, 24, 24, 48),
('Internet', 1, 3, 2, 8, 6, 18, 12, 36),
('Water Leakage', 1, 2, 2, 6, 4, 12, 12, 24);
