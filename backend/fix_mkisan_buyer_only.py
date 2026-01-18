"""Fix mKisan provider_category: Change all non-BUYER to BUYER and update schema constraint."""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from jansetu_platform.config import settings
import sqlite3

def fix_mkisan_buyer_only():
    """Update all mKisan provider_category to BUYER and update schema constraint."""
    if not settings.DATABASE_URL.startswith('sqlite'):
        print("This script is for SQLite databases only.")
        return
    
    db_path = settings.DATABASE_URL.replace('sqlite:///', '').replace('sqlite://', '')
    # If relative path, make it absolute relative to backend directory
    if db_path.startswith('./'):
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(backend_dir, db_path[2:])
    elif not os.path.isabs(db_path):
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(backend_dir, db_path)
    
    print(f"Using database: {db_path}")
    
    if not os.path.exists(db_path):
        print(f"[ERROR] Database file not found at {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    conn.execute('PRAGMA foreign_keys = ON')
    cursor = conn.cursor()
    
    try:
        # Step 1: Get all existing data and update provider_category to BUYER in memory
        print("\n[1] Preparing data migration...")
        cursor.execute("SELECT * FROM mkisan_service_providers")
        all_data = cursor.fetchall()
        
        # Get column names and find provider_category index
        cursor.execute("PRAGMA table_info(mkisan_service_providers)")
        columns_info = cursor.fetchall()
        columns = [row[1] for row in columns_info]
        category_idx = columns.index('provider_category')
        
        # Update data in memory - change all non-BUYER to BUYER
        updated_data = []
        updated_count = 0
        for row in all_data:
            row_list = list(row)
            if row_list[category_idx] != 'BUYER':
                row_list[category_idx] = 'BUYER'
                updated_count += 1
            updated_data.append(tuple(row_list))
        
        if updated_count > 0:
            print(f"[OK] Will update {updated_count} records to BUYER")
        else:
            print("[OK] All records already have BUYER category")
        
        # Step 2: Drop and recreate the table with new constraint
        # SQLite doesn't support ALTER TABLE to modify CHECK constraints, so we need to recreate the table
        print("\n[2] Updating table schema to enforce BUYER-only constraint...")
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='mkisan_service_providers'")
        if not cursor.fetchone():
            print("[ERROR] mkisan_service_providers table does not exist!")
            conn.close()
            return
        
        # Check if mkisan_purchases table exists (has foreign key reference)
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='mkisan_purchases'")
        has_purchases_table = cursor.fetchone() is not None
        
        # Disable foreign keys temporarily
        if has_purchases_table:
            print("   Temporarily disabling foreign keys...")
            conn.execute("PRAGMA foreign_keys = OFF")
        
        # Drop old table
        cursor.execute("DROP TABLE IF EXISTS mkisan_service_providers")
        
        # Create new table with BUYER-only constraint
        create_table_sql = """
        CREATE TABLE mkisan_service_providers (
            mkisan_provider_id TEXT PRIMARY KEY,
            service_provider_id TEXT UNIQUE NOT NULL,
            provider_category TEXT NOT NULL CHECK (provider_category IN ('BUYER')),
            business_license TEXT,
            gst_number TEXT,
            years_in_business INTEGER,
            verified BOOLEAN DEFAULT 0,
            isSP BOOLEAN DEFAULT 1 NOT NULL,
            created_at TEXT DEFAULT (datetime('now')) NOT NULL,
            FOREIGN KEY (service_provider_id) REFERENCES service_providers(service_provider_id) ON DELETE CASCADE
        )
        """
        cursor.execute(create_table_sql)
        print("[OK] Table recreated with BUYER-only constraint")
        
        # Re-insert data with BUYER category
        if updated_data:
            placeholders = ','.join(['?' for _ in columns])
            insert_sql = f"INSERT INTO mkisan_service_providers ({','.join(columns)}) VALUES ({placeholders})"
            cursor.executemany(insert_sql, updated_data)
            print(f"[OK] Re-inserted {len(updated_data)} records with BUYER category")
        
        # Re-enable foreign keys
        if has_purchases_table:
            conn.execute("PRAGMA foreign_keys = ON")
        
        conn.commit()
        
        # Verify
        cursor.execute("SELECT COUNT(*) FROM mkisan_service_providers")
        total_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mkisan_service_providers WHERE provider_category = 'BUYER'")
        buyer_count = cursor.fetchone()[0]
        
        print(f"\n[OK] Migration complete!")
        print(f"   Total mKisan providers: {total_count}")
        print(f"   Providers with BUYER category: {buyer_count}")
        
        if total_count == buyer_count:
            print("   [OK] All providers now have BUYER category")
        else:
            print(f"   [WARNING] {total_count - buyer_count} providers still have non-BUYER category")
        
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Migration failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    fix_mkisan_buyer_only()
