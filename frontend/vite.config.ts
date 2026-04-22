import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const rawApiUrl = env.VITE_API_URL || 'http://localhost:4174';
  const apiUrl = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: ["denticulately-pyrenocarpic-kristofer.ngrok-free.dev"],
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    preview: {
      host: "0.0.0.0",
      port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
      allowedHosts: ["farm-connnect.onrender.com"],
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "favicon-16x16.png",
          "favicon-32x32.png",
          "favicon-48x48.png",
          "apple-touch-icon.png",
          "android-chrome-192x192.png",
          "android-chrome-512x512.png",
          "screenshot-mobile.png",
          "screenshot-desktop.png"
        ],
        manifest: {
          name: "FarmConnect - Smart Agriculture Platform",
          short_name: "FarmConnect",
          description: "Empowering farmers with data-driven insights and tools.",
          theme_color: "#4a7c59",
          background_color: "#f0f4f1",
          display: "standalone",
          start_url: "/",
          orientation: "portrait-primary",
          icons: [
            { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
            { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
          ],
          screenshots: [
            { src: "/screenshot-mobile.png", sizes: "390x844", type: "image/png", form_factor: "narrow" },
            { src: "/screenshot-desktop.png", sizes: "1280x720", type: "image/png", form_factor: "wide" }
          ]
        },
        workbox: {
          navigateFallback: "/index.html",
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          globPatterns: ["**/*.{js,css,html,svg,png,ico,json}"],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "document",
              handler: "NetworkFirst",
              options: {
                cacheName: "pages-cache",
                networkTimeoutSeconds: 5
              }
            },
            {
              urlPattern: ({ request }) => ["style", "script", "worker"].includes(request.destination),
              handler: "StaleWhileRevalidate",
              options: { cacheName: "assets-cache" }
            },
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                }
              }
            },
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 30
                }
              }
            }
          ]
        }
      }),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
