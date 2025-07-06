import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: 'localhost',
    port: 3090,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '~': '/src/',
      $fonts: '/fonts',
      'url': 'whatwg-url',
    },
  },
  css: {
    devSourcemap: false,
    modules: {
      localsConvention: 'camelCase',
    },
  },
  optimizeDeps: {
    exclude: ['url'],
  },
  define: {
    'process.env': {},
    'process': {
      env: {},
      platform: 'browser',
      version: '',
      versions: {},
      type: 'browser',
      title: 'browser',
      browser: true,
      argv: [],
      execPath: '',
      execArgv: [],
      env: {},
      cwd: () => '',
      chdir: () => {},
      nextTick: (cb) => setTimeout(cb, 0),
      pid: 0,
      memoryUsage: () => ({
        heapTotal: 0,
        heapUsed: 0,
        rss: 0,
        external: 0,
        arrayBuffers: 0,
      }),
      uptime: () => 0,
      hrtime: () => [0, 0],
      exit: () => {},
      kill: () => {},
      version: '',
      versions: {},
      arch: 'x64',
      platform: 'browser',
      release: {},
      config: {},
      features: {},
      binding: () => {},
      umask: () => 0,
      uptime: () => 0,
      hrtime: () => [0, 0],
      memoryUsage: () => ({
        heapTotal: 0,
        heapUsed: 0,
        rss: 0,
        external: 0,
        arrayBuffers: 0,
      }),
      dlopen: () => {},
      uptime: () => 0,
      hrtime: () => [0, 0],
      memoryUsage: () => ({
        heapTotal: 0,
        heapUsed: 0,
        rss: 0,
        external: 0,
        arrayBuffers: 0,
      }),
      binding: () => {},
      umask: () => 0,
    }
  },
  plugins: [
    react(),
    {
      name: 'browser-compat',
      transform(code, id) {
        if (id.includes('node_modules')) {
          // Replace Node.js URL module
          code = code.replace(/require\(['"]url['"]\)/g, `require('whatwg-url')`);
          // Polyfill process.env
          code = code.replace(/process\.env\./g, 'window.process?.env?.');
          return code;
        }
        return null;
      },
    },
  ],
});