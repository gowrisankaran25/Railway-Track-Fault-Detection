const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.detectFaults = async (imagePath) => {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(imagePath));
        
        const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error calling ML service:', error.message);
        throw error;
    }
};
