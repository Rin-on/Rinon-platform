import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'al.rinon.app',
  appName: 'RinON',
  webDir: 'build',
  // No server.url - loads local build files inside the app
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false
    }
  }
};

export default config;