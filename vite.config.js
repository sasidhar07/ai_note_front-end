import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ["rp7vz4-5173.csb.app", "codesandbox.io"], 
  },
});
