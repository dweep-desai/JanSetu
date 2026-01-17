CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE citizens (
    citizen_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aadhaar_hash VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    date_of_birth DATE NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(birth_date));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

ALTER TABLE citizens ADD COLUMN age INTEGER GENERATED ALWAYS AS (calculate_age(date_of_birth)) STORED;

ALTER TABLE citizens ADD COLUMN kisan_id VARCHAR(255) UNIQUE;

CREATE TABLE esanjeevani_citizens (
    esanjeevani_citizen_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID UNIQUE NOT NULL,
    blood_group VARCHAR(5) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    chronic_conditions TEXT[],
    emergency_contact VARCHAR(15),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_esanjeevani_citizen FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id) ON DELETE CASCADE
);

CREATE TABLE esanjeevani_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    esanjeevani_citizen_id UUID NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    symptoms TEXT,
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('CONSULTATION', 'APPOINTMENT')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_esanjeevani_request FOREIGN KEY (esanjeevani_citizen_id) REFERENCES esanjeevani_citizens(esanjeevani_citizen_id) ON DELETE CASCADE
);

CREATE TABLE mkisan_citizens (
    mkisan_citizen_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID UNIQUE NOT NULL,
    kisan_id VARCHAR(255) NOT NULL,
    land_area NUMERIC(10, 2),
    land_unit VARCHAR(20),
    primary_crop VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_mkisan_citizen FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id) ON DELETE CASCADE
);

CREATE INDEX idx_citizens_aadhaar_hash ON citizens(aadhaar_hash);
CREATE INDEX idx_citizens_phone ON citizens(phone);
CREATE INDEX idx_citizens_kisan_id ON citizens(kisan_id);
CREATE INDEX idx_esanjeevani_citizens_citizen_id ON esanjeevani_citizens(citizen_id);
CREATE INDEX idx_esanjeevani_requests_citizen_id ON esanjeevani_requests(esanjeevani_citizen_id);
CREATE INDEX idx_esanjeevani_requests_status ON esanjeevani_requests(status);
CREATE INDEX idx_esanjeevani_requests_specialization ON esanjeevani_requests(specialization);
CREATE INDEX idx_mkisan_citizens_citizen_id ON mkisan_citizens(citizen_id);
CREATE INDEX idx_mkisan_citizens_kisan_id ON mkisan_citizens(kisan_id);

CREATE OR REPLACE FUNCTION validate_mkisan_citizen()
RETURNS TRIGGER AS $$
DECLARE
    citizen_kisan_id VARCHAR(255);
BEGIN
    SELECT kisan_id INTO citizen_kisan_id FROM citizens WHERE citizen_id = NEW.citizen_id;
    
    IF citizen_kisan_id IS NULL THEN
        RAISE EXCEPTION 'Cannot create mkisan_citizens record: citizen kisan_id is NULL';
    END IF;
    
    IF NEW.kisan_id != citizen_kisan_id THEN
        RAISE EXCEPTION 'mkisan_citizens.kisan_id must match citizens.kisan_id';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_mkisan_citizen_insert BEFORE INSERT ON mkisan_citizens FOR EACH ROW EXECUTE FUNCTION validate_mkisan_citizen();
CREATE TRIGGER validate_mkisan_citizen_update BEFORE UPDATE ON mkisan_citizens FOR EACH ROW EXECUTE FUNCTION validate_mkisan_citizen();

CREATE OR REPLACE FUNCTION prevent_mkisan_when_kisan_id_null()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.kisan_id IS NULL AND OLD.kisan_id IS NOT NULL THEN
        DELETE FROM mkisan_citizens WHERE citizen_id = NEW.citizen_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_mkisan_when_kisan_id_null AFTER UPDATE OF kisan_id ON citizens FOR EACH ROW WHEN (NEW.kisan_id IS NULL) EXECUTE FUNCTION prevent_mkisan_when_kisan_id_null();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_citizens_updated_at BEFORE UPDATE ON citizens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
