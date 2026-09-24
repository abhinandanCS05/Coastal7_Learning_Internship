"""create task management tables

Revision ID: 0001_create_task_management_tables
Revises:
Create Date: 2026-09-24
"""

from alembic import op
import sqlalchemy as sa


revision = "0001_task_mgmt"
down_revision = None
branch_labels = None
depends_on = None


user_role = sa.Enum(
    "USER",
    "ADMIN",
    name="user_role",
)

task_status = sa.Enum(
    "TODO",
    "IN_PROGRESS",
    "DONE",
    name="task_status",
)


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(50), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", user_role, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_index(
        "ix_users_username",
        "users",
        ["username"],
        unique=True,
    )

    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "owner_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
    )

    op.create_index(
        "ix_projects_name",
        "projects",
        ["name"],
    )

    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(150), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", task_status, nullable=False),
        sa.Column("due_date", sa.Date(), nullable=True),
        sa.Column(
            "project_id",
            sa.Integer(),
            sa.ForeignKey("projects.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "assignee_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )

    op.create_index(
        "ix_tasks_title",
        "tasks",
        ["title"],
    )

    op.create_index(
        "ix_tasks_project_id",
        "tasks",
        ["project_id"],
    )

    op.create_index(
        "ix_tasks_assignee_id",
        "tasks",
        ["assignee_id"],
    )


def downgrade():
    op.drop_index(
        "ix_tasks_assignee_id",
        table_name="tasks",
    )

    op.drop_index(
        "ix_tasks_project_id",
        table_name="tasks",
    )

    op.drop_index(
        "ix_tasks_title",
        table_name="tasks",
    )

    op.drop_table("tasks")

    op.drop_index(
        "ix_projects_name",
        table_name="projects",
    )

    op.drop_table("projects")

    op.drop_index(
        "ix_users_username",
        table_name="users",
    )

    op.drop_table("users")

    task_status.drop(op.get_bind(), checkfirst=True)
    user_role.drop(op.get_bind(), checkfirst=True)