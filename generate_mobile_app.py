import os

files = {
    "mobile-app/package.json": """{
  "name": "railway-inspector-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.15",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "expo-camera": "~13.4.4",
    "expo-location": "~16.1.0",
    "axios": "^1.5.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.14",
    "react-native-safe-area-context": "4.6.3",
    "react-native-screens": "~3.22.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
""",
    "mobile-app/app.json": """{
  "expo": {
    "name": "Railway Inspector App",
    "slug": "railway-inspector",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
""",
    "mobile-app/App.js": """import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CaptureScreen from './src/screens/CaptureScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="Capture" component={CaptureScreen} options={{ title: 'Capture Fault' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Inspection History' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
""",
    "mobile-app/src/screens/HomeScreen.jsx": """import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, Inspector 01</Text>
        <Text style={styles.subtitle}>Northern Railway Division</Text>
      </View>
      
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Capture')}
        >
          <Text style={styles.buttonText}>New Inspection</Text>
          <Text style={styles.buttonSubText}>Capture track image & report fault</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.secondaryButtonText}>View History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  cardContainer: {
    padding: 24,
    gap: 16,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    padding: 24,
    borderRadius: 16,
    alignItems: 'flex-start',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonSubText: {
    color: '#e0f2fe',
    fontSize: 14,
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  }
});
""",
    "mobile-app/src/screens/CaptureScreen.jsx": """import React, { useState, useEffect, useRef } from 'react';
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
""",
    "mobile-app/src/screens/HistoryScreen.jsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inspection History (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  text: {
    fontSize: 18,
    color: '#64748b',
  }
});
""",
    "mobile-app/src/services/api.js": """import axios from 'axios';

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
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"d:\railway-track-fault-detection", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("React Native mobile app files generated successfully.")
