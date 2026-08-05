exports.sendAlert = async (fault) => {
    // In a real app, this would integrate with Twilio or SendGrid
    console.log(`[ALERT] CRITICAL FAULT DETECTED!`);
    console.log(`Fault Type: ${fault.fault_type}`);
    console.log(`Location: Lat ${fault.lat}, Lng ${fault.lng}`);
    console.log(`Segment ID: ${fault.segment_id}`);
    console.log(`Notifying Divisional Control Room immediately...`);
    return true;
};
