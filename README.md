# Day 4 — CLI Task Manager

## Requirements covered
- PostgreSQL relational persistence via psycopg2
- Primary key and index
- CRUD task operations
- JOIN, GROUP BY/HAVING, aggregate functions
- OOP `Task` and `TaskManager` classes
- CLI interface
- JSON export
- Logging and runtime error handling
- unittest suite
- .gitignore and modular project layout
- Git/GitHub Flow instructions

## Setup
pip install -r requirements.txt

Set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, then run:
psql -U postgres -d task_manager -f scripts/schema.sql

Run: python -m task_manager.cli

Test: python -m unittest discover -s tests -v

## Git workflow
Create a feature branch, make small logical commits, push the branch, open a PR, review it, then merge to main.
