"""Manually create consultation_requests table."""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from jansetu_platform.config import settings
import sqlite3

def create_appointments_table():
    """Create consultation_requests table if it doesn't exist."""
    if not settings.DATABASE_URL.startswith('sqlite'):
        print("This script is for SQLite databases only.")
        return
    
    db_path = settings.DATABASE_URL.replace('sqlite:///', '')
    conn = sqlite3.connect(db_path)
    conn.execute('PRAGMA foreign_keys = ON')
    cursor = conn.cursor()
    
    # Read schema file
    schema_file = os.path.join(os.path.dirname(__file__), 'schema', 'appointments_schema_sqlite.sql')
    
    if not os.path.exists(schema_file):
        print(f"[ERROR] Schema file not found at {schema_file}")
        conn.close()
        return
    
    print(f"Reading schema from: {schema_file}")
    with open(schema_file, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    # Split and execute statements
    statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
    
    for statement in statements:
        if statement and not statement.startswith('--'):
            try:
                cursor.execute(statement)
                print(f"✓ Executed statement")
            except Exception as e:
                error_str = str(e).lower()
                if 'already exists' not in error_str and 'duplicate' not in error_str:
                    print(f"✗ Error: {e}")
                else:
                    print(f"✓ Table/index already exists (ignored)")
    
    conn.commit()
    
    # Verify table was created
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='consultation_requests'")
    result = cursor.fetchone()
    
    if result:
        print("[OK] consultation_requests table exists!")
    else:
        print("[ERROR] consultation_requests table was not created!")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_appointments_table()
