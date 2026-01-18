-- Consultation/Appointment Requests for e-Sanjeevani
CREATE TABLE IF NOT EXISTS consultation_requests (
    consultation_id TEXT PRIMARY KEY,
    citizen_id TEXT NOT NULL,
    esanjeevani_provider_id TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
    symptoms TEXT,
    medical_history TEXT,
    rejection_reason TEXT,
    provider_notes TEXT,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')) NOT NULL,
    FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id) ON DELETE CASCADE,
    FOREIGN KEY (esanjeevani_provider_id) REFERENCES esanjeevani_service_providers(esanjeevani_provider_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_consultation_requests_citizen_id ON consultation_requests(citizen_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_provider_id ON consultation_requests(esanjeevani_provider_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_date ON consultation_requests(appointment_date);
