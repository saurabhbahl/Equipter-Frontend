import { defineConfig ,loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
dotenv.config();
export const envs=loadEnv
const SfTargetUrl = process.env.VITE_SF_TARGET_URL;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: SfTargetUrl,
        changeOrigin: true, // This is necessary for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix when forwarding to the target
        secure:true
      },
    },
  },
});

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true,
//   },
// })

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       react: require.resolve('react'),
//       'react-dom': require.resolve('react-dom')
//     }
//   },
//   server: {
//     host: true,
//   },
// })
