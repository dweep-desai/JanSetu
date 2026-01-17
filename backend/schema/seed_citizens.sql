CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO citizens (aadhaar_hash, full_name, phone, gender, date_of_birth, address, kisan_id) VALUES
(encode(digest('ABC123456789', 'sha256'), 'hex'), 'Rajesh Kumar Singh', '9876543210', 'MALE', '1985-03-15', 'House No. 45, Sector 12, New Delhi, Delhi 110075', 'KISAN001'),
(encode(digest('ABC234567890', 'sha256'), 'hex'), 'Priya Sharma', '9876543211', 'FEMALE', '1990-07-22', 'Flat 203, Green Apartments, Mumbai, Maharashtra 400001', NULL),
(encode(digest('ABC345678901', 'sha256'), 'hex'), 'Amit Patel', '9876543212', 'MALE', '1988-11-08', '12/4 MG Road, Bangalore, Karnataka 560001', 'KISAN002'),
(encode(digest('ABC456789012', 'sha256'), 'hex'), 'Sunita Devi', '9876543213', 'FEMALE', '1992-05-30', 'Village: Bhadohi, District: Bhadohi, Uttar Pradesh 221401', 'KISAN003'),
(encode(digest('ABC567890123', 'sha256'), 'hex'), 'Vikram Mehta', '9876543214', 'MALE', '1986-09-12', 'Plot No. 67, Industrial Area, Hyderabad, Telangana 500032', NULL),
(encode(digest('ABC678901234', 'sha256'), 'hex'), 'Anjali Nair', '9876543215', 'FEMALE', '1991-12-25', 'Lane 8, Anna Nagar, Chennai, Tamil Nadu 600040', NULL),
(encode(digest('ABC789012345', 'sha256'), 'hex'), 'Ravi Kumar', '9876543216', 'MALE', '1987-02-14', 'House No. 23, Rajpur Road, Dehradun, Uttarakhand 248001', 'KISAN004'),
(encode(digest('ABC890123456', 'sha256'), 'hex'), 'Deepa Reddy', '9876543217', 'FEMALE', '1989-08-18', 'Flat 501, Tower B, Gurgaon, Haryana 122001', NULL),
(encode(digest('ABC901234567', 'sha256'), 'hex'), 'Mohan Lal', '9876543218', 'MALE', '1984-04-09', 'Village: Ratlam, District: Ratlam, Madhya Pradesh 457001', 'KISAN005'),
(encode(digest('ABC012345678', 'sha256'), 'hex'), 'Kavita Joshi', '9876543219', 'FEMALE', '1993-06-20', 'Sector 22, Noida, Uttar Pradesh 201301', NULL),
(encode(digest('ABC112233445', 'sha256'), 'hex'), 'Suresh Yadav', '9876543220', 'MALE', '1983-10-05', 'Ward No. 5, Patna, Bihar 800001', 'KISAN006'),
(encode(digest('ABC223344556', 'sha256'), 'hex'), 'Neha Gupta', '9876543221', 'FEMALE', '1994-01-15', 'MG Road, Indore, Madhya Pradesh 452001', NULL),
(encode(digest('ABC334455667', 'sha256'), 'hex'), 'Ramesh Iyer', '9876543222', 'MALE', '1985-07-28', 'T Nagar, Chennai, Tamil Nadu 600017', NULL),
(encode(digest('ABC445566778', 'sha256'), 'hex'), 'Meera Das', '9876543223', 'FEMALE', '1990-03-11', 'Salt Lake City, Kolkata, West Bengal 700064', NULL),
(encode(digest('ABC556677889', 'sha256'), 'hex'), 'Ajay Thakur', '9876543224', 'MALE', '1986-11-22', 'Village: Ludhiana, District: Ludhiana, Punjab 141001', 'KISAN007'),
(encode(digest('ABC667788990', 'sha256'), 'hex'), 'Suman Chopra', '9876543225', 'FEMALE', '1992-09-07', 'Sector 17, Chandigarh 160017', NULL),
(encode(digest('ABC778899001', 'sha256'), 'hex'), 'Gopal Rao', '9876543226', 'MALE', '1987-05-19', 'Banjara Hills, Hyderabad, Telangana 500034', NULL),
(encode(digest('ABC889900112', 'sha256'), 'hex'), 'Rekha Menon', '9876543227', 'FEMALE', '1988-12-03', 'JP Nagar, Bangalore, Karnataka 560078', NULL),
(encode(digest('ABC990011223', 'sha256'), 'hex'), 'Bharat Singh', '9876543228', 'MALE', '1984-08-16', 'Civil Lines, Jaipur, Rajasthan 302006', NULL),
(encode(digest('ABC001122334', 'sha256'), 'hex'), 'Latha Pillai', '9876543229', 'FEMALE', '1991-04-29', 'Panaji, Goa 403001', NULL);

INSERT INTO esanjeevani_citizens (citizen_id, blood_group, chronic_conditions, emergency_contact)
SELECT c.citizen_id, 'O+', ARRAY['Diabetes'], '9876540001' FROM citizens c WHERE c.full_name = 'Rajesh Kumar Singh'
UNION ALL
SELECT c.citizen_id, 'B+', NULL, '9876540002' FROM citizens c WHERE c.full_name = 'Priya Sharma'
UNION ALL
SELECT c.citizen_id, 'A+', ARRAY['Hypertension'], '9876540003' FROM citizens c WHERE c.full_name = 'Amit Patel'
UNION ALL
SELECT c.citizen_id, 'AB+', ARRAY['Asthma'], '9876540004' FROM citizens c WHERE c.full_name = 'Sunita Devi'
UNION ALL
SELECT c.citizen_id, 'O-', NULL, '9876540005' FROM citizens c WHERE c.full_name = 'Vikram Mehta'
UNION ALL
SELECT c.citizen_id, 'A-', ARRAY['Thyroid'], '9876540006' FROM citizens c WHERE c.full_name = 'Anjali Nair'
UNION ALL
SELECT c.citizen_id, 'B-', NULL, '9876540007' FROM citizens c WHERE c.full_name = 'Ravi Kumar'
UNION ALL
SELECT c.citizen_id, 'O+', ARRAY['Diabetes', 'Hypertension'], '9876540008' FROM citizens c WHERE c.full_name = 'Deepa Reddy'
UNION ALL
SELECT c.citizen_id, 'A+', NULL, '9876540009' FROM citizens c WHERE c.full_name = 'Mohan Lal'
UNION ALL
SELECT c.citizen_id, 'B+', ARRAY['Arthritis'], '9876540010' FROM citizens c WHERE c.full_name = 'Kavita Joshi';

INSERT INTO mkisan_citizens (citizen_id, kisan_id, land_area, land_unit, primary_crop, district, state)
SELECT c.citizen_id, c.kisan_id, 2.5, 'Hectares', 'Wheat', 'New Delhi', 'Delhi' FROM citizens c WHERE c.kisan_id = 'KISAN001'
UNION ALL
SELECT c.citizen_id, c.kisan_id, 3.0, 'Hectares', 'Rice', 'Bangalore Urban', 'Karnataka' FROM citizens c WHERE c.kisan_id = 'KISAN002'
UNION ALL
SELECT c.citizen_id, c.kisan_id, 1.8, 'Hectares', 'Sugarcane', 'Bhadohi', 'Uttar Pradesh' FROM citizens c WHERE c.kisan_id = 'KISAN003'
UNION ALL
SELECT c.citizen_id, c.kisan_id, 4.2, 'Hectares', 'Maize', 'Dehradun', 'Uttarakhand' FROM citizens c WHERE c.kisan_id = 'KISAN004'
UNION ALL
SELECT c.citizen_id, c.kisan_id, 2.0, 'Hectares', 'Soybean', 'Ratlam', 'Madhya Pradesh' FROM citizens c WHERE c.kisan_id = 'KISAN005'
UNION ALL
SELECT c.citizen_id, c.kisan_id, 3.5, 'Hectares', 'Pulses', 'Patna', 'Bihar' FROM citizens c WHERE c.kisan_id = 'KISAN006'
UNION ALL
SELECT c.citizen_id, c.kisan_id, 2.8, 'Hectares', 'Cotton', 'Ludhiana', 'Punjab' FROM citizens c WHERE c.kisan_id = 'KISAN007';

INSERT INTO esanjeevani_requests (esanjeevani_citizen_id, specialization, symptoms, request_type, status)
SELECT ec.esanjeevani_citizen_id, 'Orthopedic', 'Knee pain and joint stiffness', 'CONSULTATION', 'PENDING' FROM esanjeevani_citizens ec JOIN citizens c ON ec.citizen_id = c.citizen_id WHERE c.full_name = 'Rajesh Kumar Singh'
UNION ALL
SELECT ec.esanjeevani_citizen_id, 'Gynecology', 'Regular checkup', 'APPOINTMENT', 'ASSIGNED' FROM esanjeevani_citizens ec JOIN citizens c ON ec.citizen_id = c.citizen_id WHERE c.full_name = 'Priya Sharma'
UNION ALL
SELECT ec.esanjeevani_citizen_id, 'Cardiology', 'Chest pain and shortness of breath', 'CONSULTATION', 'PENDING' FROM esanjeevani_citizens ec JOIN citizens c ON ec.citizen_id = c.citizen_id WHERE c.full_name = 'Amit Patel'
UNION ALL
SELECT ec.esanjeevani_citizen_id, 'ENT', 'Persistent cough and throat pain', 'CONSULTATION', 'COMPLETED' FROM esanjeevani_citizens ec JOIN citizens c ON ec.citizen_id = c.citizen_id WHERE c.full_name = 'Sunita Devi'
UNION ALL
SELECT ec.esanjeevani_citizen_id, 'Dermatology', 'Skin rash and itching', 'CONSULTATION', 'ASSIGNED' FROM esanjeevani_citizens ec JOIN citizens c ON ec.citizen_id = c.citizen_id WHERE c.full_name = 'Vikram Mehta'
UNION ALL
SELECT ec.esanjeevani_citizen_id, 'Endocrinology', 'Thyroid follow-up', 'APPOINTMENT', 'PENDING' FROM esanjeevani_citizens ec JOIN citizens c ON ec.citizen_id = c.citizen_id WHERE c.full_name = 'Anjali Nair'
UNION ALL
SELECT ec.esanjeevani_citizen_id, 'General Medicine', 'Fever and body ache', 'CONSULTATION', 'COMPLETED' FROM esanjeevani_citizens ec JOIN citizens c ON ec.citizen_id = c.citizen_id WHERE c.full_name = 'Ravi Kumar';
