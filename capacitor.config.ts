import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  // Must match your Firebase project App ID namespace pattern
  appId: 'com.dsbd.app',
  appName: 'DSBD',
  webDir: 'dist',
  server: {
    // For development: point to Vite dev server
    // Comment out for production builds
    // url: 'http://192.168.1.x:5173',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#6366f1',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#6366f1',
    },
  },
  android: {
    // Minimum Android SDK version
    minWebViewVersion: 60,
  },
}

export default config
