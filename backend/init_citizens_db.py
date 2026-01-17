"""Initialize citizens database tables from SQL schema."""
import sys
import os
import sqlite3
import hashlib
import uuid

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from jansetu_platform.config import settings
from jansetu_platform.database import engine

def init_citizens_schema():
    """Execute the citizens schema SQL file to create tables."""
    try:
        # Use SQLite-specific schema if using SQLite, otherwise use PostgreSQL schema
        if settings.DATABASE_URL.startswith('sqlite'):
            schema_file = os.path.join(os.path.dirname(__file__), 'schema', 'esanjeevani_schema_sqlite.sql')
            seed_file = os.path.join(os.path.dirname(__file__), 'schema', 'seed_citizens_sqlite.sql')
        else:
            schema_file = os.path.join(os.path.dirname(__file__), 'schema', 'esanjeevani_schema.sql')
            seed_file = os.path.join(os.path.dirname(__file__), 'schema', 'seed_citizens.sql')
        
        if not os.path.exists(schema_file):
            print(f"Error: Schema file not found at {schema_file}")
            sys.exit(1)
        
        print(f"Reading schema file: {schema_file}")
        with open(schema_file, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        # Get database connection
        if settings.DATABASE_URL.startswith('sqlite'):
            # For SQLite, extract the database file path
            db_path = settings.DATABASE_URL.replace('sqlite:///', '')
            print(f"Connecting to SQLite database: {db_path}")
            conn = sqlite3.connect(db_path)
            # Enable foreign keys
            conn.execute('PRAGMA foreign_keys = ON')
        else:
            # For PostgreSQL, use the engine connection
            print(f"Connecting to PostgreSQL database")
            conn = engine.raw_connection()
        
        print("Creating citizens tables...")
        cursor = conn.cursor()
        
        # Split SQL by semicolons and execute each statement
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        
        for statement in statements:
            if statement:
                try:
                    cursor.execute(statement)
                except Exception as e:
                    # Ignore "already exists" errors
                    if 'already exists' not in str(e).lower() and 'duplicate' not in str(e).lower():
                        print(f"Warning: {e}")
        
        conn.commit()
        cursor.close()
        
        if settings.DATABASE_URL.startswith('sqlite'):
            conn.close()
        else:
            conn.close()
        
        print("[OK] Citizens schema created successfully!")
        
        # Also seed the data if seed file exists
        if os.path.exists(seed_file):
            print(f"\nSeeding citizens data...")
            
            if settings.DATABASE_URL.startswith('sqlite'):
                # For SQLite, we need to handle the digest function manually
                conn = sqlite3.connect(db_path)
                conn.execute('PRAGMA foreign_keys = ON')
                cursor = conn.cursor()
                
                # Manually insert the data since SQLite doesn't have digest function
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
                    from datetime import datetime
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
                            print(f"Warning inserting {aadhar}: {e}")
                
                conn.commit()
                cursor.close()
                conn.close()
            else:
                # For PostgreSQL, use the SQL file
                with open(seed_file, 'r', encoding='utf-8') as f:
                    seed_sql = f.read()
                
                conn = engine.raw_connection()
                cursor = conn.cursor()
                seed_statements = [stmt.strip() for stmt in seed_sql.split(';') if stmt.strip()]
                
                for statement in seed_statements:
                    if statement:
                        try:
                            cursor.execute(statement)
                        except Exception as e:
                            if 'already exists' not in str(e).lower() and 'duplicate' not in str(e).lower():
                                print(f"Warning during seed: {e}")
                
                conn.commit()
                cursor.close()
                conn.close()
            
            print("[OK] Citizens data seeded successfully!")
        
        print("\n[SUCCESS] Citizens database initialized!")
        
    except Exception as e:
        print(f"Error initializing citizens database: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    init_citizens_schema()
