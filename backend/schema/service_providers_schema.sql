CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE service_providers (
    service_provider_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aadhaar_hash VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    date_of_birth DATE NOT NULL,
    address TEXT,
    organization_name VARCHAR(255),
    registration_number VARCHAR(255) UNIQUE,
    isSP BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE OR REPLACE FUNCTION calculate_provider_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(birth_date));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

ALTER TABLE service_providers ADD COLUMN age INTEGER GENERATED ALWAYS AS (calculate_provider_age(date_of_birth)) STORED;

CREATE TABLE esanjeevani_service_providers (
    esanjeevani_provider_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_provider_id UUID UNIQUE NOT NULL,
    provider_type VARCHAR(50) NOT NULL CHECK (provider_type IN ('DOCTOR', 'NURSE', 'PHARMACIST', 'LAB_TECHNICIAN', 'OTHER')),
    specialization VARCHAR(100) NOT NULL,
    years_of_experience INTEGER,
    available_slots INTEGER DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    total_consultations INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    isSP BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_esanjeevani_provider FOREIGN KEY (service_provider_id) REFERENCES service_providers(service_provider_id) ON DELETE CASCADE
);

CREATE TABLE mkisan_service_providers (
    mkisan_provider_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_provider_id UUID UNIQUE NOT NULL,
    provider_category VARCHAR(50) NOT NULL CHECK (provider_category IN ('BUYER')),
    business_license VARCHAR(255),
    gst_number VARCHAR(50),
    years_in_business INTEGER,
    verified BOOLEAN DEFAULT FALSE,
    isSP BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_mkisan_provider FOREIGN KEY (service_provider_id) REFERENCES service_providers(service_provider_id) ON DELETE CASCADE
);

CREATE TABLE mkisan_purchases (
    purchase_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mkisan_provider_id UUID NOT NULL,
    product_id UUID NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    quantity_purchased VARCHAR(100),
    purchase_price_per_unit NUMERIC(10, 2),
    total_amount NUMERIC(10, 2),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_mkisan_purchase_provider FOREIGN KEY (mkisan_provider_id) REFERENCES mkisan_service_providers(mkisan_provider_id) ON DELETE CASCADE,
    CONSTRAINT fk_mkisan_purchase_product FOREIGN KEY (product_id) REFERENCES mkisan_products(product_id) ON DELETE CASCADE
);

CREATE INDEX idx_service_providers_aadhaar_hash ON service_providers(aadhaar_hash);
CREATE INDEX idx_service_providers_phone ON service_providers(phone);
CREATE INDEX idx_service_providers_registration_number ON service_providers(registration_number);
CREATE INDEX idx_esanjeevani_providers_service_provider_id ON esanjeevani_service_providers(service_provider_id);
CREATE INDEX idx_esanjeevani_providers_specialization ON esanjeevani_service_providers(specialization);
CREATE INDEX idx_esanjeevani_providers_provider_type ON esanjeevani_service_providers(provider_type);
CREATE INDEX idx_mkisan_providers_service_provider_id ON mkisan_service_providers(service_provider_id);
CREATE INDEX idx_mkisan_purchases_provider_id ON mkisan_purchases(mkisan_provider_id);
CREATE INDEX idx_mkisan_purchases_product_id ON mkisan_purchases(product_id);
CREATE INDEX idx_mkisan_purchases_status ON mkisan_purchases(status);

CREATE OR REPLACE FUNCTION update_provider_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers FOR EACH ROW EXECUTE FUNCTION update_provider_updated_at_column();
