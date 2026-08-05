import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const uploadImage = async (imageUri, lat, lng) => {
  const formData = new FormData();
  
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  });
  
  formData.append('lat', lat);
  formData.append('lng', lng);
  formData.append('segment_id', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'); // sample segment
  formData.append('reported_by', 'inspector_01');

  try {
    const response = await axios.post(`${API_BASE_URL}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};
