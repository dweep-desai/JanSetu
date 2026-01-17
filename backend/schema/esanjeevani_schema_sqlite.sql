CREATE TABLE IF NOT EXISTS citizens (
    citizen_id TEXT PRIMARY KEY,
    aadhaar_hash TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    date_of_birth TEXT NOT NULL,
    age INTEGER,
    address TEXT,
    kisan_id TEXT UNIQUE,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS esanjeevani_citizens (
    esanjeevani_citizen_id TEXT PRIMARY KEY,
    citizen_id TEXT UNIQUE NOT NULL,
    blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    chronic_conditions TEXT,
    emergency_contact TEXT,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS esanjeevani_requests (
    request_id TEXT PRIMARY KEY,
    esanjeevani_citizen_id TEXT NOT NULL,
    specialization TEXT NOT NULL,
    symptoms TEXT,
    request_type TEXT NOT NULL CHECK (request_type IN ('CONSULTATION', 'APPOINTMENT')),
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    FOREIGN KEY (esanjeevani_citizen_id) REFERENCES esanjeevani_citizens(esanjeevani_citizen_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mkisan_citizens (
    mkisan_citizen_id TEXT PRIMARY KEY,
    citizen_id TEXT UNIQUE NOT NULL,
    kisan_id TEXT NOT NULL,
    land_area REAL,
    land_unit TEXT,
    primary_crop TEXT,
    district TEXT,
    state TEXT,
    registered_at TEXT DEFAULT (datetime('now')) NOT NULL,
    FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_citizens_aadhaar_hash ON citizens(aadhaar_hash);
CREATE INDEX IF NOT EXISTS idx_citizens_phone ON citizens(phone);
CREATE INDEX IF NOT EXISTS idx_citizens_kisan_id ON citizens(kisan_id);
CREATE INDEX IF NOT EXISTS idx_esanjeevani_citizens_citizen_id ON esanjeevani_citizens(citizen_id);
CREATE INDEX IF NOT EXISTS idx_esanjeevani_requests_citizen_id ON esanjeevani_requests(esanjeevani_citizen_id);
CREATE INDEX IF NOT EXISTS idx_esanjeevani_requests_status ON esanjeevani_requests(status);
CREATE INDEX IF NOT EXISTS idx_esanjeevani_requests_specialization ON esanjeevani_requests(specialization);
CREATE INDEX IF NOT EXISTS idx_mkisan_citizens_citizen_id ON mkisan_citizens(citizen_id);
CREATE INDEX IF NOT EXISTS idx_mkisan_citizens_kisan_id ON mkisan_citizens(kisan_id);
