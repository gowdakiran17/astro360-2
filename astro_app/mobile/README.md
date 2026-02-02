# Astro360 Mobile App

This is the mobile application for Astro360, built with **React Native (Expo)** and **NativeWind**.

## Features
-   **Authentication**: Login/Signup integrated with Backend API.
-   **Routing**: File-based routing with Expo Router.
-   **Styling**: API-compatible TailwindCSS via NativeWind from v4.
-   **State Management**: React Context / Hooks.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the app:**
    ```bash
    npx expo start
    ```

3.  **Run on Device/Simulator:**
    -   Press `i` to open in iOS Simulator.
    -   Press `a` to open in Android Emulator.
    -   Scan the QR code with Expo Go app on your physical device.

## Project Structure
-   `app/`: Pages and routing (Expo Router).
    -   `(auth)/`: Login and Signup screens.
    -   `(tabs)/`: Main dashboard tabs.
-   `components/`: Reusable UI components.
-   `services/`: API clients (axios).
-   `assets/`: Images and fonts.

## Configuration
-   **API URL**: Configured in `services/api.ts`. Default is production: `https://astro360-2.onrender.com/api`.
