import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "INGE-APP",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      backgroundColor: "#000000",
      launchShowDuration: 3000,
      showSpinner: false,
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId:
        "143084504266-m64qjq4oio23hrpc55s0qs86fq84o7sq.apps.googleusercontent.com", // Reemplaza con el Client ID obtenido de Google Cloud Console
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
