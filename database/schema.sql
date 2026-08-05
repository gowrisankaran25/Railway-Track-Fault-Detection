-- Enable PostGIS extension for spatial capabilities
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID generation (optional, but good practice for distributed systems)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: TrackSegment
CREATE TABLE IF NOT EXISTS TrackSegment (
    segment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone VARCHAR(100) NOT NULL,
    division VARCHAR(100) NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    
    -- Storing lat/lng as raw coordinates for easy access
    start_lat DECIMAL(10, 8),
    start_lng DECIMAL(11, 8),
    end_lat DECIMAL(10, 8),
    end_lng DECIMAL(11, 8),
    
    -- PostGIS Geometry points for spatial queries (SRID 4326 = WGS 84)
    start_geom GEOMETRY(Point, 4326),
    end_geom GEOMETRY(Point, 4326),
    
    last_inspected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: FaultReport
CREATE TABLE IF NOT EXISTS FaultReport (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_id UUID REFERENCES TrackSegment(segment_id) ON DELETE CASCADE,
    image_url VARCHAR(512),
    
    -- Enum-like constraints for fault types and severity
    fault_type VARCHAR(50) NOT NULL CHECK (fault_type IN ('crack', 'misalignment', 'obstruction', 'missing_fishplate', 'vegetation_overgrowth', 'other')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
    
    confidence_score DECIMAL(5, 4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    
    -- Storing lat/lng as raw coordinates
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    
    -- PostGIS Geometry point for spatial queries (e.g., finding nearest faults, heatmaps)
    location_geom GEOMETRY(Point, 4326),
    
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved')),
    reported_by VARCHAR(100) -- e.g., gangman_id or drone_flight_id
);

-- Create a spatial index for faster geographical queries on faults (e.g., heatmap generation)
CREATE INDEX IF NOT EXISTS idx_faultreport_location ON FaultReport USING GIST (location_geom);

-- Table: InspectionLog
CREATE TABLE IF NOT EXISTS InspectionLog (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_id UUID REFERENCES TrackSegment(segment_id) ON DELETE CASCADE,
    inspector_id VARCHAR(100) NOT NULL,
    inspection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Trigger to update last_inspected_at in TrackSegment upon new InspectionLog
CREATE OR REPLACE FUNCTION update_last_inspected_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE TrackSegment
    SET last_inspected_at = NEW.inspection_date
    WHERE segment_id = NEW.segment_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_inspected_at
AFTER INSERT ON InspectionLog
FOR EACH ROW
EXECUTE FUNCTION update_last_inspected_at();
