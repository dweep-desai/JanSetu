"""Add isSP column to existing service provider tables."""
import sys
import os
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from jansetu_platform.config import settings

def add_issp_column():
    """Add isSP column to service provider tables if it doesn't exist."""
    try:
        if not settings.DATABASE_URL.startswith('sqlite'):
            print("This script is for SQLite databases only.")
            return
        
        db_path = settings.DATABASE_URL.replace('sqlite:///', '')
        conn = sqlite3.connect(db_path)
        conn.execute('PRAGMA foreign_keys = ON')
        cursor = conn.cursor()
        
        # Check if column exists and add if missing
        cursor.execute("PRAGMA table_info(service_providers)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'isSP' not in columns:
            print("Adding isSP column to service_providers...")
            cursor.execute("ALTER TABLE service_providers ADD COLUMN isSP BOOLEAN DEFAULT 1 NOT NULL")
            # Update existing records
            cursor.execute("UPDATE service_providers SET isSP = 1 WHERE isSP IS NULL")
            print("[OK] isSP column added to service_providers")
        else:
            print("[OK] isSP column already exists in service_providers")
        
        cursor.execute("PRAGMA table_info(esanjeevani_service_providers)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'isSP' not in columns:
            print("Adding isSP column to esanjeevani_service_providers...")
            cursor.execute("ALTER TABLE esanjeevani_service_providers ADD COLUMN isSP BOOLEAN DEFAULT 1 NOT NULL")
            cursor.execute("UPDATE esanjeevani_service_providers SET isSP = 1 WHERE isSP IS NULL")
            print("[OK] isSP column added to esanjeevani_service_providers")
        else:
            print("[OK] isSP column already exists in esanjeevani_service_providers")
        
        cursor.execute("PRAGMA table_info(mkisan_service_providers)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'isSP' not in columns:
            print("Adding isSP column to mkisan_service_providers...")
            cursor.execute("ALTER TABLE mkisan_service_providers ADD COLUMN isSP BOOLEAN DEFAULT 1 NOT NULL")
            cursor.execute("UPDATE mkisan_service_providers SET isSP = 1 WHERE isSP IS NULL")
            print("[OK] isSP column added to mkisan_service_providers")
        else:
            print("[OK] isSP column already exists in mkisan_service_providers")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("[SUCCESS] All isSP columns updated successfully!")
        
    except Exception as e:
        print(f"Error adding isSP column: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    add_issp_column()
