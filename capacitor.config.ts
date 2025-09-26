import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mobile.nusabaca.com',
  appName: 'Nusabaca',
  webDir: 'www',
  android: {
    allowMixedContent: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    EdgeToEdge: {
      backgroundColor: "#ffffff",
    },
    StatusBar: {
      overlaysWebView: true,
      style: "DARK",
    },
  }
};

export default config;
