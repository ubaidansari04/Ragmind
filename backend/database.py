import sqlite3
import os
from datetime import datetime

DB_PATH = os.getenv("DB_PATH", "app_data.db")

def get_connection():
    """Returns a new SQLite connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn

def init_db():
    """Creates tables if they don't exist."""
    conn = get_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            username    TEXT    UNIQUE NOT NULL,
            email       TEXT    UNIQUE NOT NULL,
            password_hash TEXT  NOT NULL,
            created_at  TEXT    NOT NULL
        )
    """)

    # Sessions table (each conversation = one session)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            session_id  TEXT    UNIQUE NOT NULL,
            title       TEXT    NOT NULL DEFAULT 'New Chat',
            created_at  TEXT    NOT NULL,
            updated_at  TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # Messages table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id  TEXT    NOT NULL,
            role        TEXT    NOT NULL,   -- 'user' or 'assistant'
            content     TEXT    NOT NULL,
            created_at  TEXT    NOT NULL,
            FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
        )
    """)

    conn.commit()
    conn.close()
    print("Database initialized successfully.")


# ── User helpers ──────────────────────────────────────────────

def create_user(username: str, email: str, password_hash: str) -> int:
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (username, email, password_hash, datetime.utcnow().isoformat())
        )
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()

def get_user_by_email(email: str) -> dict | None:
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def get_user_by_id(user_id: int) -> dict | None:
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


# ── Session helpers ───────────────────────────────────────────

def create_or_update_session(user_id: int, session_id: str, title: str = "New Chat"):
    """Upsert a chat session for the user."""
    conn = get_connection()
    try:
        now = datetime.utcnow().isoformat()
        existing = conn.execute(
            "SELECT id FROM chat_sessions WHERE session_id = ?", (session_id,)
        ).fetchone()

        if existing:
            conn.execute(
                "UPDATE chat_sessions SET updated_at = ? WHERE session_id = ?",
                (now, session_id)
            )
        else:
            conn.execute(
                "INSERT INTO chat_sessions (user_id, session_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                (user_id, session_id, title, now, now)
            )
        conn.commit()
    finally:
        conn.close()

def update_session_title(session_id: str, title: str):
    conn = get_connection()
    try:
        conn.execute(
            "UPDATE chat_sessions SET title = ? WHERE session_id = ?",
            (title, session_id)
        )
        conn.commit()
    finally:
        conn.close()

def get_user_sessions(user_id: int) -> list[dict]:
    """Returns all sessions for a user, newest first."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC",
            (user_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

def delete_session(session_id: str, user_id: int):
    """Delete a session and all its messages."""
    conn = get_connection()
    try:
        # Verify ownership first
        row = conn.execute(
            "SELECT id FROM chat_sessions WHERE session_id = ? AND user_id = ?",
            (session_id, user_id)
        ).fetchone()
        if not row:
            return False
        conn.execute("DELETE FROM chat_messages WHERE session_id = ?", (session_id,))
        conn.execute("DELETE FROM chat_sessions WHERE session_id = ?", (session_id,))
        conn.commit()
        return True
    finally:
        conn.close()


# ── Message helpers ───────────────────────────────────────────

def save_message(session_id: str, role: str, content: str):
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO chat_messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)",
            (session_id, role, content, datetime.utcnow().isoformat())
        )
        conn.commit()
    finally:
        conn.close()

def get_session_messages(session_id: str) -> list[dict]:
    """Returns all messages for a session in chronological order."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC",
            (session_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()