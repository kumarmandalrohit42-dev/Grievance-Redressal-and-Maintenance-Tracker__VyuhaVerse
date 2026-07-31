# CampusCare AI - Database Architecture

This directory houses the relational database schema, Prisma ORM definition, and seed datasets for the CampusCare AI platform.

## 📁 Contents

- **`schema.sql`**: Native SQL schema definitions compatible with PostgreSQL, MySQL, and SQLite.
- **`prisma/schema.prisma`**: Type-safe Prisma ORM schema for backend database integration.
- **`seeds/seed_data.sql`**: Production-like initial seed dataset containing departments, buildings, default users, and SLA thresholds.

## 🗄️ Database Entity Relationship (ER) Overview

1. **`users`**: Stores user accounts for Students, Technicians, Department Heads, and Admins.
2. **`buildings`**: Stores campus infrastructure location metadata, coordinates, health scores, and active issue counts.
3. **`departments`**: Stores department metadata, active technicians, and SLA performance metrics.
4. **`complaints`**: Core ticket table tracking priorities (P1-P4), lifecycle status, AI summaries, and student/technician/building relations.
5. **`timeline_events`**: Audit history log of all ticket state transitions.
6. **`attachments`**: Media files (images, audio notes, proof of work).
7. **`sla_configs`**: Configurable response and resolution time windows per category.

## 🚀 How to Apply Schema

### Option 1: Direct SQL Execution (PostgreSQL / MySQL / SQLite)

```bash
psql -U postgres -d campuscare_db -f schema.sql
psql -U postgres -d campuscare_db -f seeds/seed_data.sql
```

### Option 2: Prisma Migration (Recommended for Backend)

```bash
npx prisma migrate dev --name init
npx prisma db seed
```
