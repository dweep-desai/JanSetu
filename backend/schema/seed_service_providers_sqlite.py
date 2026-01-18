"""Seed service providers data for SQLite."""
import sys
import os
import sqlite3
import hashlib
import uuid
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from jansetu_platform.config import settings

def seed_service_providers():
    """Seed service providers data."""
    try:
        if not settings.DATABASE_URL.startswith('sqlite'):
            print("This script is for SQLite databases only.")
            return
        
        db_path = settings.DATABASE_URL.replace('sqlite:///', '')
        conn = sqlite3.connect(db_path)
        conn.execute('PRAGMA foreign_keys = ON')
        cursor = conn.cursor()
        
        # Check if e-Sanjeevani providers already exist (seed only if none exist)
        cursor.execute("SELECT COUNT(*) FROM esanjeevani_service_providers")
        esanjeevani_count = cursor.fetchone()[0]
        if esanjeevani_count > 0:
            print(f"[INFO] E-Sanjeevani providers already exist ({esanjeevani_count} records). Skipping seed.")
            conn.close()
            return
        
        print("Seeding service providers data...")
        
        # Service provider base data
        service_providers_data = [
            # e-Sanjeevani Providers (10 doctors/healthcare providers)
            ('ABC900100100', 'Dr. Ramesh Kumar', '9876501001', 'MALE', '1975-06-15', 'Sector 5, New Delhi, Delhi 110005', 'Apollo Hospitals', 'REG001'),
            ('ABC900100101', 'Dr. Priya Sharma', '9876501002', 'FEMALE', '1980-03-22', 'MG Road, Bangalore, Karnataka 560001', 'Fortis Healthcare', 'REG002'),
            ('ABC900100102', 'Dr. Amit Verma', '9876501003', 'MALE', '1978-11-08', 'Andheri West, Mumbai, Maharashtra 400053', 'AIIMS Mumbai', 'REG003'),
            ('ABC900100103', 'Dr. Sunita Reddy', '9876501004', 'FEMALE', '1982-05-30', 'Jubilee Hills, Hyderabad, Telangana 500033', 'Care Hospitals', 'REG004'),
            ('ABC900100104', 'Dr. Vikram Iyer', '9876501005', 'MALE', '1976-09-12', 'Anna Nagar, Chennai, Tamil Nadu 600040', 'Apollo Hospitals Chennai', 'REG005'),
            ('ABC900100105', 'Dr. Anjali Patel', '9876501006', 'FEMALE', '1981-12-25', 'Satellite, Ahmedabad, Gujarat 380015', 'HCG Hospitals', 'REG006'),
            ('ABC900100106', 'Dr. Ravi Menon', '9876501007', 'MALE', '1979-02-14', 'Salt Lake, Kolkata, West Bengal 700064', 'AMRI Hospitals', 'REG007'),
            ('ABC900100107', 'Dr. Deepa Nair', '9876501008', 'FEMALE', '1983-08-18', 'Punjabi Bagh, New Delhi, Delhi 110026', 'Max Healthcare', 'REG008'),
            ('ABC900100108', 'Dr. Mohan Das', '9876501009', 'MALE', '1977-04-09', 'Banjara Hills, Hyderabad, Telangana 500034', 'Yashoda Hospitals', 'REG009'),
            ('ABC900100109', 'Dr. Kavita Gupta', '9876501010', 'FEMALE', '1984-06-20', 'Sector 17, Chandigarh 160017', 'PGI Chandigarh', 'REG010'),
            
            # mKisan Providers (10 procurement agents/wholesalers)
            ('ABC900200100', 'Rajesh Procurement Ltd', '9876502001', 'MALE', '1970-01-15', 'Industrial Area, Delhi 110020', 'Rajesh Procurement Ltd', 'REG201'),
            ('ABC900200101', 'Green Fields Wholesale', '9876502002', 'FEMALE', '1975-03-20', 'Market Yard, Pune, Maharashtra 411037', 'Green Fields Wholesale', 'REG202'),
            ('ABC900200102', 'Agri Supply Network', '9876502003', 'MALE', '1972-07-10', 'Krishna Market, Bangalore, Karnataka 560001', 'Agri Supply Network', 'REG203'),
            ('ABC900200103', 'Farm Fresh Exports', '9876502004', 'MALE', '1968-11-25', 'Port Area, Mumbai, Maharashtra 400001', 'Farm Fresh Exports Pvt Ltd', 'REG204'),
            ('ABC900200104', 'Golden Grains Trading', '9876502005', 'FEMALE', '1973-05-18', 'Anand Nagar, Indore, Madhya Pradesh 452001', 'Golden Grains Trading Co', 'REG205'),
            ('ABC900200106', 'Harvest Direct Retail', '9876502006', 'MALE', '1971-09-08', 'Commercial Street, Chennai, Tamil Nadu 600001', 'Harvest Direct Retail', 'REG206'),
            ('ABC900200107', 'Organic Agri Hub', '9876502007', 'FEMALE', '1976-12-30', 'Green Valley, Dehradun, Uttarakhand 248001', 'Organic Agri Hub', 'REG207'),
            ('ABC900200108', 'Grain Masters Processing', '9876502008', 'MALE', '1969-02-14', 'Industrial Zone, Ludhiana, Punjab 141001', 'Grain Masters Processing Unit', 'REG208'),
            ('ABC900200109', 'Fresh Produce Co', '9876502009', 'MALE', '1974-08-22', 'Sabzi Mandi, Jaipur, Rajasthan 302006', 'Fresh Produce Company', 'REG209'),
            ('ABC900200110', 'Agri Link Procurement', '9876502010', 'FEMALE', '1977-04-11', 'Agricultural Market, Patna, Bihar 800001', 'Agri Link Procurement Services', 'REG210'),
        ]
        
        e_sanjeevani_data = [
            ('DOCTOR', 'Orthopedic', 15, 20, 4.5, 1500),
            ('DOCTOR', 'Gynecology', 12, 15, 4.7, 1200),
            ('DOCTOR', 'Cardiology', 18, 25, 4.8, 2000),
            ('DOCTOR', 'Pediatrics', 10, 18, 4.6, 1000),
            ('DOCTOR', 'Dermatology', 14, 12, 4.4, 800),
            ('DOCTOR', 'ENT', 13, 10, 4.3, 750),
            ('DOCTOR', 'Oncology', 16, 8, 4.9, 1500),
            ('DOCTOR', 'Neurology', 17, 6, 4.8, 1800),
            ('DOCTOR', 'General Medicine', 19, 30, 4.5, 900),
            ('DOCTOR', 'Psychiatry', 11, 10, 4.6, 1000),
        ]
        
        mkisan_data = [
            ('BUYER', 'LIC123456', 'GST01ABCD1234A1Z5', 10),
            ('BUYER', 'LIC234567', 'GST02EFGH5678B2Y6', 15),
            ('BUYER', 'LIC345678', 'GST03IJKL9012C3X7', 8),
            ('BUYER', 'LIC456789', 'GST04MNOP3456D4W8', 20),
            ('BUYER', 'LIC567890', 'GST05QRST7890E5V9', 12),
            ('BUYER', 'LIC678901', 'GST06UVWX2345F6U0', 5),
            ('BUYER', 'LIC789012', 'GST07YZAB6789G7T1', 9),
            ('BUYER', 'LIC890123', 'GST08CDEF0123H8S2', 18),
            ('BUYER', 'LIC901234', 'GST09GHIJ4567I9R3', 14),
            ('BUYER', 'LIC012345', 'GST10KLMN8901J0Q4', 11),
        ]
        
        # Insert service providers
        for idx, (aadhar, name, phone, gender, dob, address, org, reg_num) in enumerate(service_providers_data):
            service_provider_id = str(uuid.uuid4())
            aadhaar_hash = hashlib.sha256(aadhar.encode()).hexdigest()
            birth_date = datetime.strptime(dob, '%Y-%m-%d')
            age = (datetime.now() - birth_date).days // 365
            
            try:
                cursor.execute("""
                    INSERT INTO service_providers 
                    (service_provider_id, aadhaar_hash, full_name, phone, gender, date_of_birth, age, address, organization_name, registration_number, isSP)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                """, (service_provider_id, aadhaar_hash, name, phone, gender, dob, age, address, org, reg_num))
                
                # Insert e-Sanjeevani provider (first 10)
                if idx < 10:
                    esanjeevani_provider_id = str(uuid.uuid4())
                    provider_type, specialization, exp, slots, rating, consultations = e_sanjeevani_data[idx]
                    cursor.execute("""
                        INSERT INTO esanjeevani_service_providers 
                        (esanjeevani_provider_id, service_provider_id, provider_type, specialization, years_of_experience, available_slots, rating, total_consultations, isSP)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
                    """, (esanjeevani_provider_id, service_provider_id, provider_type, specialization, exp, slots, rating, consultations))
                
                # Insert mKisan provider (last 10)
                else:
                    mkisan_provider_id = str(uuid.uuid4())
                    category, license, gst, years = mkisan_data[idx - 10]
                    cursor.execute("""
                        INSERT INTO mkisan_service_providers 
                        (mkisan_provider_id, service_provider_id, provider_category, business_license, gst_number, years_in_business, isSP)
                        VALUES (?, ?, ?, ?, ?, ?, 1)
                    """, (mkisan_provider_id, service_provider_id, category, license, gst, years))
                    
            except Exception as e:
                if 'UNIQUE' not in str(e):
                    print(f"Warning inserting {aadhar}: {e}")
        
        conn.commit()
        
        # Insert some sample purchases for mKisan providers (if products exist)
        cursor.execute("SELECT mkisan_provider_id FROM mkisan_service_providers LIMIT 5")
        mkisan_provider_ids = [row[0] for row in cursor.fetchall()]
        
        cursor.execute("SELECT product_id, price_per_unit FROM mkisan_products LIMIT 10")
        products = cursor.fetchall()
        
        if mkisan_provider_ids and products:
            print("Creating sample purchase records...")
            for provider_id in mkisan_provider_ids[:3]:  # First 3 providers
                for product_id, price_per_unit in products[:2]:  # First 2 products per provider
                    purchase_id = str(uuid.uuid4())
                    quantity = "50 Quintals"
                    total = float(price_per_unit) * 50
                    
                    cursor.execute("""
                        INSERT INTO mkisan_purchases 
                        (purchase_id, mkisan_provider_id, product_id, quantity_purchased, purchase_price_per_unit, total_amount, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (purchase_id, provider_id, product_id, quantity, float(price_per_unit), total, 'COMPLETED'))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("[OK] Service providers data seeded successfully!")
        print(f"   - {len(service_providers_data)} service providers created")
        print(f"   - 10 e-Sanjeevani providers")
        print(f"   - 10 mKisan providers")
        
    except Exception as e:
        print(f"Error seeding service providers: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    seed_service_providers()
