import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds a single self-contained IIFE script. It defines the
// <sw-flight-search> custom element as a side effect of loading —
// that's the whole integration surface an EDS block needs.
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: 'src/webcomponent.tsx',
      formats: ['iife'],
      name: 'FlightSearchWidget',
      fileName: () => 'flight-search-widget.js',
    },
    cssCodeSplit: false,
    outDir: 'dist',
  },
});
