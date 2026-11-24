import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.graphicdesign.app",
  appName: "GraphicDesign",
  webDir: "public",
  server: {
    url: "https://graphicdesign-app.vercel.app",
    cleartext: false,
  },
  android: {
    backgroundColor: "#ffffff",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: "automatic",
    allowsLinkPreview: false,
    scrollEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#2563eb",
      splashFullScreen: true,
      splashImmersive: true,
    },

    Filesystem: {
      permissions: ["write"],
    },
    Share: {
      permissions: ["photo"],
    },
  },
};

export default config;
