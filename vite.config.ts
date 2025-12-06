import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    define: {
      'process.env': env
    },
    plugins: [
      react(),
      svgr(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/services': path.resolve(__dirname, './src/services'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/lib': path.resolve(__dirname, './src/lib'),
        '@/context': path.resolve(__dirname, './src/context'),
        '@/styles': path.resolve(__dirname, './src/styles'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/utils': path.resolve(__dirname, './src/lib/utils'),
        '@/api': path.resolve(__dirname, './src/lib/api'),
      },
    },
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'query-vendor': ['@tanstack/react-query'],
            
            // UI library chunks
            'ui-radix': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
              '@radix-ui/react-toast',
              '@radix-ui/react-tooltip',
              '@radix-ui/react-tabs',
              '@radix-ui/react-accordion',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-label',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-switch',
            ],
            
            // Heavy dependencies
            'icons': ['react-icons', 'lucide-react'],
            'charts': ['recharts'],
            'animations': ['framer-motion', 'swiper', 'embla-carousel-react'],
            'date': ['date-fns', 'react-day-picker'],
            'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          },
        },
      },
      chunkSizeWarningLimit: 500,
      reportCompressedSize: true,
      sourcemap: mode === 'development',
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
      ],
    },
  };
});