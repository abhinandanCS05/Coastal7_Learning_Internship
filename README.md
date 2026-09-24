# Day 7 – Task Management REST API

## Overview

This project is a Task Management REST API developed using FastAPI as part of the Coastal Seven Knowledge Factory Internship Program – Batch 7.

The project demonstrates secure authentication and authorization, PostgreSQL database integration, project and task management, CRUD operations, task status workflow, filtering and pagination, error handling, API documentation, Postman testing, and automated testing.

## Objectives

The main objectives of this project are:

- Implement JWT-based authentication and authorization.
- Implement user registration and login.
- Implement role-based access control.
- Build complete CRUD operations for Projects and Tasks.
- Implement task status workflow management.
- Implement filtering and pagination.
- Integrate PostgreSQL with SQLAlchemy.
- Manage database schema using Alembic migrations.
- Implement standardized error handling.
- Provide Swagger/OpenAPI documentation.
- Create and test a Postman collection.
- Implement automated API tests using Pytest.
- Maintain a clean and modular FastAPI project structure.

## Technologies Used

- Python
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- Alembic
- Pydantic V2
- Pydantic Settings
- JWT
- Passlib
- bcrypt
- Uvicorn
- Pytest
- Postman
- Swagger / OpenAPI

## Project Structure

The project follows a modular structure separating application configuration, database handling, models, schemas, security, dependencies, exceptions, and API routers.

- `app/` – Main application package.
- `app/routers/auth.py` – Authentication-related endpoints.
- `app/routers/projects.py` – Project management endpoints.
- `app/routers/tasks.py` – Task management endpoints.
- `app/models.py` – SQLAlchemy database models.
- `app/schemas.py` – Pydantic request and response schemas.
- `app/security.py` – Password hashing and JWT functionality.
- `app/dependencies.py` – Authentication and authorization dependencies.
- `app/exceptions.py` – Custom error handling.
- `app/database.py` – Database configuration and session management.
- `alembic/` – Database migration configuration and migration scripts.
- `scripts/create_admin.py` – Utility for creating an administrator user.
- `tests/` – Automated API tests.
- `docs/` – API testing documentation.
- `postman/` – Postman API collection.
- `exports/` – Export-related directory.
- `logs/` – Application log directory.

## Authentication and Authorization

The API implements JWT-based authentication with secure password hashing using bcrypt.

The authentication flow includes:

- User registration.
- User login.
- Password hashing.
- JWT access token generation.
- JWT refresh token generation.
- Current user verification.
- Protected API endpoints.
- Role-based access control.

Authentication endpoints:

- `POST /auth/register` – Register a new user.
- `POST /auth/login` – Login and generate access and refresh tokens.
- `GET /auth/me` – Retrieve the currently authenticated user.
- `POST /auth/refresh` – Generate a new access token using a refresh token.

The application supports two roles:

- `USER`
- `ADMIN`

## Project Management

The API provides complete CRUD functionality for projects.

Available operations:

- `POST /projects` – Create a project.
- `GET /projects` – List projects with pagination.
- `GET /projects/{project_id}` – Retrieve a specific project.
- `PUT /projects/{project_id}` – Update a project.
- `DELETE /projects/{project_id}` – Delete a project.

Projects are associated with their respective owners.

## Task Management

Tasks are associated with projects and can optionally be assigned to users.

Available operations:

- `POST /projects/{project_id}/tasks` – Create a task.
- `GET /tasks` – List and filter tasks.
- `GET /tasks/{task_id}` – Retrieve a specific task.
- `PUT /tasks/{task_id}` – Update a task.
- `DELETE /tasks/{task_id}` – Delete a task.

## Task Status Workflow

Tasks follow a controlled status workflow:

`TODO → IN_PROGRESS → DONE`

The API validates status transitions and prevents invalid backward transitions.

For example:

- `TODO → IN_PROGRESS` – Valid.
- `IN_PROGRESS → DONE` – Valid.
- `DONE → TODO` – Invalid.

## Filtering and Pagination

The task listing endpoint supports filtering based on:

- Task status.
- Assignee.
- Due date.

Pagination is supported using:

- `skip`
- `limit`

Example:

`GET /tasks?status=TODO&assignee_id=1&due_date=2026-10-01&skip=0&limit=10`

This allows clients to retrieve only the required tasks and control the number of records returned.

## Database

The application uses PostgreSQL as the primary database and SQLAlchemy for database modeling and operations.

The main database entities are:

- User
- Project
- Task

The relationships are structured as follows:

- A User can own multiple Projects.
- A Project can contain multiple Tasks.
- A Task belongs to a Project.
- A Task can optionally be assigned to a User.

Foreign keys and indexes are used to maintain data relationships and improve query efficiency.

## Alembic Database Migrations

Alembic is used to manage database schema changes.

Run the migration using:

`alembic upgrade head`

To check the current migration:

`alembic current`

The migration creates the required Users, Projects, and Tasks tables along with their relationships, indexes, role enum, and task status enum.

## Environment Configuration

The application uses environment variables for configuration.

Create a `.env` file based on `.env.example` and configure:

- PostgreSQL database URL.
- JWT secret key.
- Access token expiration.
- Refresh token expiration.
- Allowed origins.

Sensitive configuration such as database credentials and JWT secrets is stored in `.env` and excluded from Git using `.gitignore`.

## Running the Application

Create a virtual environment:

`python -m venv .venv`

Activate the virtual environment on Windows:

`.venv\Scripts\Activate.ps1`

Install the required dependencies:

`pip install -r requirements.txt`

Apply the database migrations:

`alembic upgrade head`

Start the FastAPI application:

`uvicorn app.main:app --reload`

The application runs at:

`http://127.0.0.1:8000`

## API Documentation

FastAPI provides interactive Swagger/OpenAPI documentation at:

`http://127.0.0.1:8000/docs`

The API was tested through Swagger for:

- User registration and login.
- JWT authentication.
- Project CRUD.
- Task CRUD.
- Filtering.
- Pagination.
- Task status workflow.
- Error handling.
- Authorization behavior.

## Postman Testing

A Postman collection is included in:

`postman/Task_Management_API.postman_collection.json`

The collection contains requests for:

- Register.
- Login.
- Current user.
- Refresh token.
- Create Project.
- List Projects.
- Update Project.
- Create Task.
- Filter and Pagination.
- Update Task Status.
- Update Task.
- Delete Task.

The API workflows were also successfully verified using Postman.

## Error Handling

The API implements appropriate HTTP status codes and standardized error responses.

The implementation handles:

- `400 Bad Request` – Invalid request or business rule violation.
- `401 Unauthorized` – Missing or invalid authentication.
- `403 Forbidden` – Insufficient permissions.
- `404 Not Found` – Resource not found.
- `409 Conflict` – Database or duplicate-resource conflict.
- `422 Validation Error` – Invalid request data.

FastAPI validation errors and database integrity errors are handled through centralized exception handling.

## Automated Testing

Pytest is used for automated API testing.

Run the tests using:

`pytest`

Current test result:

**2 tests passed successfully.**

## Testing Summary

The completed API was validated through three testing approaches:

**Swagger/OpenAPI**
- Authentication.
- Project CRUD.
- Task CRUD.
- Filtering.
- Pagination.
- Status workflow.
- Error handling.

**Postman**
- Authentication and JWT flow.
- Project CRUD.
- Task CRUD.
- Filtering and pagination.
- Task status workflow.

**Pytest**
- Automated API test cases.
- Result: **2 passed.**

## Expected Outcome

The completed project demonstrates the implementation of a complete Task Management REST API with:

- Secure authentication.
- JWT token management.
- Role-based authorization.
- PostgreSQL database integration.
- SQLAlchemy data modeling.
- Alembic migrations.
- Project CRUD operations.
- Task CRUD operations.
- Task status workflow.
- Filtering and pagination.
- Error handling.
- Swagger/OpenAPI documentation.
- Postman API testing.
- Automated testing using Pytest.
- Modular and maintainable FastAPI architecture.
