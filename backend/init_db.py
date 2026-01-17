"""Initialize database with tables and initial roles."""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from jansetu_platform.database import engine, Base, SessionLocal
from jansetu_platform.models import User, Role, Service, ServiceOnboardingRequest, RequestLog, RoleType

def init_database():
    """Initialize database tables and roles."""
    try:
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("[OK] Tables created successfully")
        
        print("Creating initial roles...")
        db = SessionLocal()
        try:
            for role_type in [RoleType.CITIZEN, RoleType.SERVICE_PROVIDER, RoleType.ADMIN]:
                role = db.query(Role).filter(Role.name == role_type).first()
                if not role:
                    role = Role(name=role_type)
                    db.add(role)
                    print(f"[OK] Created role: {role_type.value}")
                else:
                    print(f"[OK] Role already exists: {role_type.value}")
            
            db.commit()
            print("\n[SUCCESS] Database initialized successfully!")
        except Exception as e:
            db.rollback()
            print(f"Error creating roles: {e}")
            raise
        finally:
            db.close()
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        print("\nMake sure:")
        print("1. PostgreSQL is running")
        print("2. Database 'jansetu' exists")
        print("3. Connection string in config.py is correct")
        print("4. Wait a few seconds for PostgreSQL to fully start")
        sys.exit(1)

if __name__ == "__main__":
    init_database()
