"""Auto-initialize citizens database on startup."""
import os
import sqlite3
import hashlib
import uuid
from sqlalchemy import text, inspect
from .database import engine
from .config import settings

def check_citizens_table_exists(db):
    """Check if citizens table exists in the database."""
    try:
        if settings.DATABASE_URL.startswith('sqlite'):
            # For SQLite, check using SQL directly
            result = db.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='citizens'"))
            return result.fetchone() is not None
        else:
            # For PostgreSQL, use inspector
            inspector = inspect(engine)
            return 'citizens' in inspector.get_table_names()
    except Exception as e:
        # If check fails, assume table doesn't exist
        return False

def init_citizens_schema_on_startup(db):
    """Initialize citizens schema if tables don't exist."""
    try:
        # Always initialize service providers (they're independent)
        init_service_providers_schema_on_startup(db)
        
        # Check if citizens table already exists
        if check_citizens_table_exists(db):
            return  # Tables already exist, no need to initialize
        
        # Import here to avoid circular dependencies
        from jansetu_platform.database import get_db
        
        print("[INFO] Citizens tables not found. Initializing citizens database schema...")
        
        # Use SQLite-specific schema if using SQLite, otherwise use PostgreSQL schema
        if settings.DATABASE_URL.startswith('sqlite'):
            schema_file = os.path.join(os.path.dirname(__file__), '..', 'schema', 'esanjeevani_schema_sqlite.sql')
        else:
            schema_file = os.path.join(os.path.dirname(__file__), '..', 'schema', 'esanjeevani_schema.sql')
        
        if not os.path.exists(schema_file):
            print(f"[WARNING] Citizens schema file not found at {schema_file}. Skipping citizens initialization.")
            return
        
        # Read and execute schema
        with open(schema_file, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        # Get database connection
        if settings.DATABASE_URL.startswith('sqlite'):
            db_path = settings.DATABASE_URL.replace('sqlite:///', '')
            conn = sqlite3.connect(db_path)
            conn.execute('PRAGMA foreign_keys = ON')
            cursor = conn.cursor()
        else:
            conn = engine.raw_connection()
            cursor = conn.cursor()
        
        # Split SQL by semicolons and execute each statement
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        
        for statement in statements:
            if statement and not statement.startswith('--'):
                try:
                    if settings.DATABASE_URL.startswith('sqlite'):
                        cursor.execute(statement)
                    else:
                        cursor.execute(statement)
                except Exception as e:
                    # Ignore "already exists" errors
                    error_str = str(e).lower()
                    if 'already exists' not in error_str and 'duplicate' not in error_str:
                        # Only print if it's a real error (not just table already exists)
                        pass
        
        # Also ensure mkisan_products table exists (in case schema file was updated after initial creation)
        if settings.DATABASE_URL.startswith('sqlite'):
            try:
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='mkisan_products'")
                if not cursor.fetchone():
                    # Table doesn't exist, create it
                    cursor.execute("""
                        CREATE TABLE IF NOT EXISTS mkisan_products (
                            product_id TEXT PRIMARY KEY,
                            mkisan_citizen_id TEXT NOT NULL,
                            product_name TEXT NOT NULL,
                            product_type TEXT NOT NULL,
                            category TEXT NOT NULL,
                            quantity TEXT NOT NULL,
                            price_per_unit REAL NOT NULL,
                            location TEXT,
                            description TEXT,
                            created_at TEXT DEFAULT (datetime('now')) NOT NULL,
                            updated_at TEXT DEFAULT (datetime('now')) NOT NULL,
                            FOREIGN KEY (mkisan_citizen_id) REFERENCES mkisan_citizens(mkisan_citizen_id) ON DELETE CASCADE
                        )
                    """)
                    cursor.execute("CREATE INDEX IF NOT EXISTS idx_mkisan_products_mkisan_citizen_id ON mkisan_products(mkisan_citizen_id)")
                    cursor.execute("CREATE INDEX IF NOT EXISTS idx_mkisan_products_category ON mkisan_products(category)")
                    cursor.execute("CREATE INDEX IF NOT EXISTS idx_mkisan_products_product_type ON mkisan_products(product_type)")
                    conn.commit()
                    print("[OK] mkisan_products table created during initialization")
            except Exception as e:
                # If mkisan_citizens doesn't exist yet, that's okay - it will be created by the schema
                pass
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("[OK] Citizens schema initialized successfully!")
        
        # Seed data if using SQLite and file exists
        if settings.DATABASE_URL.startswith('sqlite'):
            seed_citizens_data_sqlite()
        
    except Exception as e:
        # Don't fail startup if citizens init fails - just log it
        print(f"[WARNING] Failed to initialize citizens schema: {e}")
        print("[INFO] You can manually initialize by running: python init_citizens_db.py")

def init_service_providers_schema_on_startup(db):
    """Initialize service providers schema if tables don't exist."""
    try:
        if settings.DATABASE_URL.startswith('sqlite'):
            # Check if service_providers table exists
            result = db.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='service_providers'"))
            if result.fetchone():
                return  # Tables already exist
            
            schema_file = os.path.join(os.path.dirname(__file__), '..', 'schema', 'service_providers_schema_sqlite.sql')
        else:
            from sqlalchemy import inspect
            inspector = inspect(engine)
            if 'service_providers' in inspector.get_table_names():
                return
            schema_file = os.path.join(os.path.dirname(__file__), '..', 'schema', 'service_providers_schema.sql')
        
        if not os.path.exists(schema_file):
            print(f"[WARNING] Service providers schema file not found at {schema_file}.")
            return
        
        print("[INFO] Initializing service providers schema...")
        
        # Read and execute schema
        with open(schema_file, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        # Get database connection
        if settings.DATABASE_URL.startswith('sqlite'):
            db_path = settings.DATABASE_URL.replace('sqlite:///', '')
            conn = sqlite3.connect(db_path)
            conn.execute('PRAGMA foreign_keys = ON')
            cursor = conn.cursor()
        else:
            conn = engine.raw_connection()
            cursor = conn.cursor()
        
        # Split SQL by semicolons and execute each statement
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        
        for statement in statements:
            if statement and not statement.startswith('--') and not statement.startswith('CREATE EXTENSION'):
                try:
                    cursor.execute(statement)
                except Exception as e:
                    error_str = str(e).lower()
                    if 'already exists' not in error_str and 'duplicate' not in error_str:
                        pass
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("[OK] Service providers schema initialized successfully!")
        
    except Exception as e:
        print(f"[WARNING] Failed to initialize service providers schema: {e}")


def seed_citizens_data_sqlite():
    """Seed initial citizens data for SQLite."""
    try:
        from datetime import datetime
        
        db_path = settings.DATABASE_URL.replace('sqlite:///', '')
        conn = sqlite3.connect(db_path)
        conn.execute('PRAGMA foreign_keys = ON')
        cursor = conn.cursor()
        
        # Check if data already exists
        cursor.execute("SELECT COUNT(*) FROM citizens")
        count = cursor.fetchone()[0]
        if count > 0:
            conn.close()
            return  # Data already exists
        
        # Insert sample citizens data
        citizens_data = [
            ('ABC123456789', 'Rajesh Kumar Singh', '9876543210', 'MALE', '1985-03-15', 'House No. 45, Sector 12, New Delhi, Delhi 110075', 'KISAN001'),
            ('ABC234567890', 'Priya Sharma', '9876543211', 'FEMALE', '1990-07-22', 'Flat 203, Green Apartments, Mumbai, Maharashtra 400001', None),
            ('ABC345678901', 'Amit Patel', '9876543212', 'MALE', '1988-11-08', '12/4 MG Road, Bangalore, Karnataka 560001', 'KISAN002'),
            ('ABC456789012', 'Sunita Devi', '9876543213', 'FEMALE', '1992-05-30', 'Village: Bhadohi, District: Bhadohi, Uttar Pradesh 221401', 'KISAN003'),
            ('ABC567890123', 'Vikram Mehta', '9876543214', 'MALE', '1986-09-12', 'Plot No. 67, Industrial Area, Hyderabad, Telangana 500032', None),
            ('ABC678901234', 'Anjali Nair', '9876543215', 'FEMALE', '1991-12-25', 'Lane 8, Anna Nagar, Chennai, Tamil Nadu 600040', None),
            ('ABC789012345', 'Ravi Kumar', '9876543216', 'MALE', '1987-02-14', 'House No. 23, Rajpur Road, Dehradun, Uttarakhand 248001', 'KISAN004'),
            ('ABC890123456', 'Deepa Reddy', '9876543217', 'FEMALE', '1989-08-18', 'Flat 501, Tower B, Gurgaon, Haryana 122001', None),
            ('ABC901234567', 'Mohan Lal', '9876543218', 'MALE', '1984-04-09', 'Village: Ratlam, District: Ratlam, Madhya Pradesh 457001', 'KISAN005'),
            ('ABC012345678', 'Kavita Joshi', '9876543219', 'FEMALE', '1993-06-20', 'Sector 22, Noida, Uttar Pradesh 201301', None),
            ('ABC112233445', 'Suresh Yadav', '9876543220', 'MALE', '1983-10-05', 'Ward No. 5, Patna, Bihar 800001', 'KISAN006'),
            ('ABC223344556', 'Neha Gupta', '9876543221', 'FEMALE', '1994-01-15', 'MG Road, Indore, Madhya Pradesh 452001', None),
            ('ABC334455667', 'Ramesh Iyer', '9876543222', 'MALE', '1985-07-28', 'T Nagar, Chennai, Tamil Nadu 600017', None),
            ('ABC445566778', 'Meera Das', '9876543223', 'FEMALE', '1990-03-11', 'Salt Lake City, Kolkata, West Bengal 700064', None),
            ('ABC556677889', 'Ajay Thakur', '9876543224', 'MALE', '1986-11-22', 'Village: Ludhiana, District: Ludhiana, Punjab 141001', 'KISAN007'),
            ('ABC667788990', 'Suman Chopra', '9876543225', 'FEMALE', '1992-09-07', 'Sector 17, Chandigarh 160017', None),
            ('ABC778899001', 'Gopal Rao', '9876543226', 'MALE', '1987-05-19', 'Banjara Hills, Hyderabad, Telangana 500034', None),
            ('ABC889900112', 'Rekha Menon', '9876543227', 'FEMALE', '1988-12-03', 'JP Nagar, Bangalore, Karnataka 560078', None),
            ('ABC990011223', 'Bharat Singh', '9876543228', 'MALE', '1984-08-16', 'Civil Lines, Jaipur, Rajasthan 302006', None),
            ('ABC001122334', 'Latha Pillai', '9876543229', 'FEMALE', '1991-04-29', 'Panaji, Goa 403001', None),
        ]
        
        for aadhar, name, phone, gender, dob, address, kisan_id in citizens_data:
            citizen_id = str(uuid.uuid4())
            aadhaar_hash = hashlib.sha256(aadhar.encode()).hexdigest()
            # Calculate age
            birth_date = datetime.strptime(dob, '%Y-%m-%d')
            age = (datetime.now() - birth_date).days // 365
            
            try:
                cursor.execute("""
                    INSERT OR IGNORE INTO citizens 
                    (citizen_id, aadhaar_hash, full_name, phone, gender, date_of_birth, age, address, kisan_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (citizen_id, aadhaar_hash, name, phone, gender, dob, age, address, kisan_id))
            except Exception as e:
                if 'UNIQUE' not in str(e):
                    pass  # Ignore insert errors
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("[OK] Sample citizens data seeded successfully!")
    except Exception as e:
        print(f"[WARNING] Failed to seed citizens data: {e}")
