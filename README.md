# Railway Command Center (RCC)

The **Railway Track Fault Detection System (RCC)** is a modern, full-stack application designed to monitor railway infrastructure, manage drone fleets, coordinate inspectors, and provide real-time alerts for track anomalies using predictive maintenance and machine learning.

## 🚀 Project Overview

The system is composed of several key modules:
- **Dashboard (`/dashboard`)**: A sleek, dark-themed React application built with Vite. It features live maps (Leaflet), real-time system health monitoring, archive management, and drone/inspector coordination. 
- **Mobile App (`/mobile-app`)**: A React Native (Expo) mobile application designed for field inspectors to capture and report track faults.
- **Backend & ML Services**: Data pipelines and machine learning models for detecting faults automatically from drone feeds.

## 💻 Tech Stack

### Web Dashboard
- **Framework**: React 18, Vite
- **Styling**: Custom CSS (Dark/Light mode support, glassmorphism), CSS Variables
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Maps**: React Leaflet
- **Charts**: Recharts

### Mobile App
- **Framework**: React Native, Expo
- **Navigation**: React Navigation

## 🛠️ Recent UI/UX Improvements

The Dashboard has undergone significant UI polishing to ensure a premium, accessible, and bug-free experience:
- **Routing & Navigation**: Fully integrated previously orphaned pages (`Drone Fleet`, `Inspectors`, `Predictive Maintenance`) into the main React Router (`App.jsx`) and the Sidebar navigation.
- **Component Styling Independence**: Decoupled UI components (`Button`, `Input`, `Select`, `Tabs`) from uncompiled Tailwind CSS classes. They now utilize native Vanilla CSS (`primary-btn`, `text-input`, `secondary-btn`) directly linked to `index.css`, guaranteeing perfect rendering.
- **Login Screen Refinements**: Fixed input box sizing and absolute positioning of input icons (`Mail`, `Lock`) so they perfectly align inside the text fields.
- **System Health Formatting**: Implemented strict floating-point formatting (`.toFixed(1)`) on live-updating system metrics (CPU, Memory, Network) to prevent text overflow and layout breakage on the dashboard cards.
- **Settings & Archive Polishing**: Improved `Select` dropdown visibility, fixed `Tabs` active states, added distinct placeholder colors (`rgba(255, 255, 255, 0.4)`), and updated the `Trash2` ghost buttons to blend beautifully with the dark aesthetic.
- **Build Optimization**: Removed unused, 0-byte placeholder files to prevent Vite build errors.

## ⚙️ Getting Started

### Running the Dashboard

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

To create an optimized production build for the dashboard:
```bash
npm run build
```

### Running the Mobile App

1. Navigate to the mobile app directory:
   ```bash
   cd mobile-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   npx expo start
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```text
MIT License

Copyright (c) 2024 Railway Track Fault Detection System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**Developed by [Your Name]** *(Please replace this with your actual name)*
