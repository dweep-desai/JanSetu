CREATE TABLE IF NOT EXISTS service_providers (
    service_provider_id TEXT PRIMARY KEY,
    aadhaar_hash TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    date_of_birth TEXT NOT NULL,
    age INTEGER,
    address TEXT,
    organization_name TEXT,
    registration_number TEXT UNIQUE,
    isSP BOOLEAN DEFAULT 1 NOT NULL,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS esanjeevani_service_providers (
    esanjeevani_provider_id TEXT PRIMARY KEY,
    service_provider_id TEXT UNIQUE NOT NULL,
    provider_type TEXT NOT NULL CHECK (provider_type IN ('DOCTOR', 'NURSE', 'PHARMACIST', 'LAB_TECHNICIAN', 'OTHER')),
    specialization TEXT NOT NULL,
    years_of_experience INTEGER,
    available_slots INTEGER DEFAULT 0,
    rating REAL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    total_consultations INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT 0,
    isSP BOOLEAN DEFAULT 1 NOT NULL,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(service_provider_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mkisan_service_providers (
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
);

CREATE TABLE IF NOT EXISTS mkisan_purchases (
    purchase_id TEXT PRIMARY KEY,
    mkisan_provider_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    purchase_date TEXT DEFAULT (datetime('now')) NOT NULL,
    quantity_purchased TEXT,
    purchase_price_per_unit REAL,
    total_amount REAL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    FOREIGN KEY (mkisan_provider_id) REFERENCES mkisan_service_providers(mkisan_provider_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES mkisan_products(product_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_service_providers_aadhaar_hash ON service_providers(aadhaar_hash);
CREATE INDEX IF NOT EXISTS idx_service_providers_phone ON service_providers(phone);
CREATE INDEX IF NOT EXISTS idx_service_providers_registration_number ON service_providers(registration_number);
CREATE INDEX IF NOT EXISTS idx_esanjeevani_providers_service_provider_id ON esanjeevani_service_providers(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_esanjeevani_providers_specialization ON esanjeevani_service_providers(specialization);
CREATE INDEX IF NOT EXISTS idx_esanjeevani_providers_provider_type ON esanjeevani_service_providers(provider_type);
CREATE INDEX IF NOT EXISTS idx_mkisan_providers_service_provider_id ON mkisan_service_providers(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_mkisan_purchases_provider_id ON mkisan_purchases(mkisan_provider_id);
CREATE INDEX IF NOT EXISTS idx_mkisan_purchases_product_id ON mkisan_purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_mkisan_purchases_status ON mkisan_purchases(status);
