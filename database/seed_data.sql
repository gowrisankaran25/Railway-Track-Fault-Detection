-- Sample Track Segments
INSERT INTO TrackSegment (segment_id, zone, division, route_name, start_lat, start_lng, end_lat, end_lng, start_geom, end_geom)
VALUES 
    ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Northern Railway', 'Delhi', 'New Delhi - Ambala', 28.6139, 77.2090, 28.7041, 77.1025, ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), ST_SetSRID(ST_MakePoint(77.1025, 28.7041), 4326)),
    ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Western Railway', 'Mumbai Central', 'Mumbai Central - Surat', 18.9696, 72.8197, 19.0176, 72.8562, ST_SetSRID(ST_MakePoint(72.8197, 18.9696), 4326), ST_SetSRID(ST_MakePoint(72.8562, 19.0176), 4326));

-- Sample Fault Reports
INSERT INTO FaultReport (segment_id, image_url, fault_type, severity, confidence_score, lat, lng, location_geom, status, reported_by)
VALUES
    ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://example.com/images/fault1.jpg', 'crack', 'critical', 0.95, 28.6500, 77.1500, ST_SetSRID(ST_MakePoint(77.1500, 28.6500), 4326), 'pending', 'drone_flight_101'),
    ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://example.com/images/fault2.jpg', 'missing_fishplate', 'major', 0.88, 28.6600, 77.1600, ST_SetSRID(ST_MakePoint(77.1600, 28.6600), 4326), 'verified', 'gangman_42'),
    ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://example.com/images/fault3.jpg', 'vegetation_overgrowth', 'minor', 0.76, 18.9900, 72.8300, ST_SetSRID(ST_MakePoint(72.8300, 18.9900), 4326), 'resolved', 'gangman_17');

-- Sample Inspection Logs
INSERT INTO InspectionLog (segment_id, inspector_id, notes)
VALUES
    ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'inspector_01', 'Routine drone inspection completed. Found one critical crack.'),
    ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'inspector_02', 'Manual track walk. Cleared minor vegetation overgrowth.');
