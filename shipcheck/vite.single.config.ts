import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Self-contained single-file build: one index.html with JS + CSS inlined.
// Needed for hosts that only accept a single file per deployment.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-single', cssCodeSplit: false, assetsInlineLimit: 100_000_000 },
})
