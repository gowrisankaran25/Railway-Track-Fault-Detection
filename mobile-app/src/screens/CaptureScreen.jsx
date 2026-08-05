import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { uploadImage } from '../services/api';

export default function CaptureScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && locStatus === 'granted');
      
      if (locStatus === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data);
    }
  };

  const handleUpload = async () => {
    if (!photo || !location) return;
    setIsUploading(true);
    try {
      // Mocking upload to our Node.js backend
      // await uploadImage(photo.uri, location.coords.latitude, location.coords.longitude);
      Alert.alert("Success", "Fault report uploaded successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to upload report.");
    } finally {
      setIsUploading(false);
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera or location</Text>;

  return (
    <View style={styles.container}>
      {!photo ? (
        <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.previewImage} />
          <View style={styles.detailsContainer}>
            <Text style={styles.locText}>
              Lat: {location?.coords.latitude.toFixed(5)}
            </Text>
            <Text style={styles.locText}>
              Lng: {location?.coords.longitude.toFixed(5)}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.retakeBtn} onPress={() => setPhoto(null)}>
              <Text style={styles.btnText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} disabled={isUploading}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>{isUploading ? 'Uploading...' : 'Submit Report'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  captureButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  previewContainer: { flex: 1, backgroundColor: '#000' },
  previewImage: { flex: 1, resizeMode: 'contain' },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#1e293b',
  },
  locText: { color: '#fff', fontSize: 16 },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1e293b',
    gap: 12,
  },
  retakeBtn: {
    flex: 1,
    padding: 16,
    backgroundColor: '#475569',
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadBtn: {
    flex: 2,
    padding: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
