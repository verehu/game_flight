import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const adapterCode = readFileSync(
  resolve(import.meta.dirname, 'scripts/wx-adapter-runtime.js'),
  'utf-8'
)

export default defineConfig({
  build: {
    target: 'es2018',
    lib: {
      entry: resolve(import.meta.dirname, 'src/main-minigame.js'),
      name: 'GameFlight',
      formats: ['iife'],
      fileName: () => 'game-bundle.js'
    },
    outDir: 'minigame/js',
    emptyOutDir: false,
    copyPublicDir: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        intro: adapterCode,
        inlineDynamicImports: true
      }
    }
  },
  define: {
    __MINIGAME__: JSON.stringify(true)
  }
})
