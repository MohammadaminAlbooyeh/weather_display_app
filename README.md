# Weather Display iOS App

A simple weather app with a Python (Flask) backend and a React Native (Expo) frontend for iOS.

## Project Structure

- `backend/` : Python/Flask server providing mock weather data
- `weather_frontend/` : React Native (Expo) mobile app

---

## Backend Setup (Python/Flask)

1. Go to the backend folder:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install flask
   ```

4. Run the server:

   ```bash
   python app.py
   ```

   The server will run on port 5001 and provide mock weather data.

---

## Frontend Setup (React Native/Expo)

1. Go to the weather_frontend folder:

   ```bash
   cd weather_frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Install additional packages:

   ```bash
   npx expo install expo-linear-gradient
   ```

4. Start the app:

   ```bash
   npx expo start
   ```

5. Use the Expo Go app on your iPhone to scan the QR code and run the app.

---

## Important Notes

- The Flask server IP must match your WiFi network IP and be set in the `index.tsx` (frontend) file.
- If you get a fetch error, make sure the backend IP is correct and both devices (Mac and iPhone) are on the same network.
- The app UI is inspired by modern weather apps and is fully customizable.

---

## Sample Screenshot

![Sample UI](./screenshot.png)

---

**Created by MohammadaminAlbooyeh**
